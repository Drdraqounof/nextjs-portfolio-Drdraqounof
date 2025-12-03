'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cleanup;
    
    import('three').then((THREE) => {
      if (!containerRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(pixelRatio);
      containerRef.current.appendChild(renderer.domElement);

      const resolution = 256;
      const waterBuffers = {
        current: new Float32Array(resolution * resolution),
        previous: new Float32Array(resolution * resolution),
        velocity: new Float32Array(resolution * resolution * 2),
      };

      for (let i = 0; i < resolution * resolution; i++) {
        waterBuffers.current[i] = 0.0;
        waterBuffers.previous[i] = 0.0;
        waterBuffers.velocity[i * 2] = 0.0;
        waterBuffers.velocity[i * 2 + 1] = 0.0;
      }

      const waterTexture = new THREE.DataTexture(
        waterBuffers.current,
        resolution,
        resolution,
        THREE.RedFormat,
        THREE.FloatType
      );
      waterTexture.minFilter = THREE.LinearFilter;
      waterTexture.magFilter = THREE.LinearFilter;
      waterTexture.needsUpdate = true;

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_speed;
        uniform sampler2D u_waterTexture;
        uniform float u_waterStrength;
        uniform int u_gradientTheme;
        
        varying vec2 vUv;

        vec4 electricPlasma(vec2 u, float t) {
          float a=0., d=0., i=0.;
          for (; i < 8.; d += sin(i++ * u.y + a))
             a += sin(i - d + 0.15 * t - a * u.x);
          vec3 c = mix(vec3(0.1,0.0,0.8), vec3(0.5,0.2,1.0), .5+.5*cos(a));
          c = mix(c, vec3(1.0), .5+.5*sin(d));
          return vec4(c, 1.0);
        }

        vec4 moltenGold(vec2 u, float t) {
          float a=0., d=0., i=0.;
          for (; i < 10.; d += cos(i++ * u.y * 0.8 + a))
            a += cos(i - d + 0.1 * t - a * u.x + length(u));
          vec3 c = mix(vec3(0.), vec3(0.6,0.1,0.0), smoothstep(-1.,1.,cos(d)));
          c = mix(c, vec3(1.0,0.5,0.0), smoothstep(-.5,.5,sin(a)));
          c = mix(c, vec3(1.0,0.9,0.3), smoothstep(0.8,1.,cos(a+d)));
          return vec4(pow(c, vec3(1.5)), 1.0);
        }

        vec4 getGradientColor(vec2 u, float t, int theme) {
          if (theme == 0) return electricPlasma(u, t);
          else return moltenGold(u, t);
        }

        void main() {
          vec2 r = u_resolution;
          vec2 FC = gl_FragCoord.xy;
          vec2 screenP = (FC.xy * 2.0 - r) / r.y;
          
          vec2 wCoord = vec2(FC.x / r.x, FC.y / r.y);
          float waterHeight = texture2D(u_waterTexture, wCoord).r;
          float waterInfluence = clamp(waterHeight * u_waterStrength, -0.5, 0.5);
          
          vec2 gradientUV = screenP + vec2(waterInfluence * 0.3, waterInfluence * 0.2);
          float modifiedTime = u_time * u_speed + waterInfluence * 2.0;
          vec4 gradientColor = getGradientColor(gradientUV, modifiedTime, u_gradientTheme);
          
          gl_FragColor = gradientColor;
        }
      `;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: { value: 0.0 },
          u_resolution: { value: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio) },
          u_speed: { value: 1.3 },
          u_waterTexture: { value: waterTexture },
          u_waterStrength: { value: 0.55 },
          u_gradientTheme: { value: 0 }
        }
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 1;

      const clock = new THREE.Clock();

      const updateWaterSimulation = () => {
        const { current, previous } = waterBuffers;
        const damping = 0.913;
        const tension = 0.02;

        for (let i = 1; i < resolution - 1; i++) {
          for (let j = 1; j < resolution - 1; j++) {
            const index = i * resolution + j;
            const top = previous[index - resolution];
            const bottom = previous[index + resolution];
            const left = previous[index - 1];
            const right = previous[index + 1];

            current[index] = (top + bottom + left + right) / 2 - current[index];
            current[index] = current[index] * damping + previous[index] * (1 - damping);
            current[index] += (0 - previous[index]) * tension;
            current[index] = Math.max(-2.0, Math.min(2.0, current[index]));
          }
        }

        [waterBuffers.current, waterBuffers.previous] = [waterBuffers.previous, waterBuffers.current];
        waterTexture.image.data = waterBuffers.current;
        waterTexture.needsUpdate = true;
      };

      const addRipple = (x, y, strength = 1.0) => {
        const normalizedX = x / window.innerWidth;
        const normalizedY = 1.0 - y / window.innerHeight;
        const texX = Math.floor(normalizedX * resolution);
        const texY = Math.floor(normalizedY * resolution);
        const radius = 8;
        const rippleStrength = strength * 0.5;

        for (let i = -radius; i <= radius; i++) {
          for (let j = -radius; j <= radius; j++) {
            const distanceSquared = i * i + j * j;
            if (distanceSquared <= radius * radius) {
              const posX = texX + i;
              const posY = texY + j;
              if (posX >= 0 && posX < resolution && posY >= 0 && posY < resolution) {
                const index = posY * resolution + posX;
                const distance = Math.sqrt(distanceSquared);
                const falloff = 1.0 - distance / radius;
                const rippleValue = Math.cos((distance / radius) * Math.PI * 0.5) * rippleStrength * falloff;
                waterBuffers.previous[index] += rippleValue;
              }
            }
          }
        }
      };

      let lastMousePosition = { x: 0, y: 0 };
      let mouseThrottleTime = 0;

      const onMouseMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const now = performance.now();

        if (now - mouseThrottleTime < 8) return;
        mouseThrottleTime = now;

        const dx = x - lastMousePosition.x;
        const dy = y - lastMousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          const baseIntensity = Math.min(distance / 20, 1.0);
          addRipple(x, y, baseIntensity * 1.2);
          lastMousePosition = { x, y };
        }
      };

      const onMouseClick = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        addRipple(x, y, 3.0);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('click', onMouseClick);

      const animate = () => {
        const animationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        material.uniforms.u_time.value = elapsed;
        updateWaterSimulation();
        renderer.render(scene, camera);
      };

      const onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const currentPixelRatio = Math.min(window.devicePixelRatio, 2);
        renderer.setSize(width, height);
        renderer.setPixelRatio(currentPixelRatio);
        material.uniforms.u_resolution.value.set(width * currentPixelRatio, height * currentPixelRatio);
      };

      window.addEventListener('resize', onWindowResize);

      setTimeout(() => {
        addRipple(window.innerWidth / 2, window.innerHeight / 2, 1.5);
      }, 500);

      animate();

      cleanup = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onMouseClick);
        window.removeEventListener('resize', onWindowResize);
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <main ref={containerRef} id="container" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <header className="brand">
        <h1 className="logo-text">Frontend Web Developer</h1>
      </header>

      <div className="center-header">
        <h1 className="main-title">Welcome to My Portfolio</h1>
        <p className="main-subtitle">Interactive Design & Development</p>
      </div>

      <nav className="nav-links" role="navigation" aria-label="Main navigation">
        <Link href="/projects" aria-label="Projects page">Projects</Link>
        <Link href="/about" aria-label="About page">About</Link>
        <Link href="/contact" aria-label="Contact page">Contact</Link>
      </nav>

      <footer className="page-footer">
        <nav className="social-links" role="navigation" aria-label="Social media links">
          <a href="https://github.com/Drdraqounof" aria-label="View GitHub profile" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/juliendanielroane" aria-label="Connect on LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:jdani0066@launchpadphilly.org" aria-label="Send an email">Email</a>
        </nav>
      </footer>
    </main>
  );
}
