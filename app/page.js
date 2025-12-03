'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './portfolio.module.css';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [emailCopied, setEmailCopied] = useState(false);
  const [fps, setFps] = useState(60);
  const [cursorInfo, setCursorInfo] = useState({ x: 0, y: 0, radius: 0.08, merges: 0 });
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const clockRef = useRef(null);
  const animationFrameRef = useRef(null);
  const projectRefs = useRef([]);

  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Scroll animation for projects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = projectRefs.current.indexOf(entry.target);
            if (index !== -1 && !visibleProjects.includes(index)) {
              setVisibleProjects((prev) => [...prev, index]);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      projectRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleProjects]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });

    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uActualResolution: { value: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio) },
        uPixelRatio: { value: pixelRatio },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
        uCursorRadius: { value: 0.08 },
        uSphereCount: { value: isMobile ? 4 : 6 },
        uFixedTopLeftRadius: { value: 0.8 },
        uFixedBottomRightRadius: { value: 0.9 },
        uSmallTopLeftRadius: { value: 0.3 },
        uSmallBottomRightRadius: { value: 0.35 },
        uSmoothness: { value: 0.8 },
        uAmbientIntensity: { value: 0.12 },
        uDiffuseIntensity: { value: 1.2 },
        uSpecularIntensity: { value: 2.5 },
        uSpecularPower: { value: 3 },
        uFresnelPower: { value: 0.8 },
        uBackgroundColor: { value: new THREE.Color(0x0a0a15) },
        uSphereColor: { value: new THREE.Color(0x050510) },
        uLightColor: { value: new THREE.Color(0xccaaff) },
        uLightPosition: { value: new THREE.Vector3(0.9, 0.9, 1.2) },
        uContrast: { value: 1.6 },
        uFogDensity: { value: 0.06 },
        uAnimationSpeed: { value: 0.6 },
        uMovementScale: { value: 1.2 },
        uCursorGlowIntensity: { value: 1.2 },
        uCursorGlowRadius: { value: 2.2 },
        uCursorGlowColor: { value: new THREE.Color(0xaa77ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uActualResolution;
        uniform vec2 uMousePosition;
        uniform vec3 uCursorSphere;
        uniform float uCursorRadius;
        uniform int uSphereCount;
        uniform float uFixedTopLeftRadius;
        uniform float uFixedBottomRightRadius;
        uniform float uSmallTopLeftRadius;
        uniform float uSmallBottomRightRadius;
        uniform float uSmoothness;
        uniform float uAmbientIntensity;
        uniform float uDiffuseIntensity;
        uniform float uSpecularIntensity;
        uniform float uSpecularPower;
        uniform float uFresnelPower;
        uniform vec3 uBackgroundColor;
        uniform vec3 uSphereColor;
        uniform vec3 uLightColor;
        uniform vec3 uLightPosition;
        uniform float uContrast;
        uniform float uFogDensity;
        uniform float uAnimationSpeed;
        uniform float uMovementScale;
        uniform float uCursorGlowIntensity;
        uniform float uCursorGlowRadius;
        uniform vec3 uCursorGlowColor;
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float EPSILON = 0.001;
        const float MAX_DIST = 100.0;
        
        float smin(float a, float b, float k) {
          float h = max(k - abs(a - b), 0.0) / k;
          return min(a, b) - h * h * k * 0.25;
        }
        
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        vec3 screenToWorld(vec2 normalizedPos) {
          vec2 uv = normalizedPos * 2.0 - 1.0;
          uv.x *= uResolution.x / uResolution.y;
          return vec3(uv * 2.0, 0.0);
        }
        
        float sceneSDF(vec3 pos) {
          float result = MAX_DIST;
          
          vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
          float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
          
          vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
          float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
          
          vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
          float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
          
          vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
          float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
          
          float t = uTime * uAnimationSpeed;
          
          for (int i = 0; i < 6; i++) {
            if (i >= uSphereCount) break;
            
            float fi = float(i);
            float speed = 0.4 + fi * 0.12;
            float radius = 0.12 + mod(fi, 3.0) * 0.06;
            float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * uMovementScale;
            float phaseOffset = fi * PI * 0.35;
            
            vec3 offset = vec3(
              sin(t * speed + phaseOffset) * orbitRadius * 0.8,
              cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
              sin(t * speed * 0.5 + phaseOffset) * 0.3
            );
            
            float movingSphere = sdSphere(pos - offset, radius);
            result = smin(result, movingSphere, 0.05);
          }
          
          float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
          
          float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
          float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
          
          result = smin(result, topLeftGroup, 0.3);
          result = smin(result, bottomRightGroup, 0.3);
          result = smin(result, cursorBall, uSmoothness);
          
          return result;
        }
        
        vec3 calcNormal(vec3 p) {
          float eps = 0.001;
          return normalize(vec3(
            sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
            sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
            sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
          ));
        }
        
        float rayMarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          for (int i = 0; i < 48; i++) {
            vec3 p = ro + rd * t;
            float d = sceneSDF(p);
            if (d < EPSILON) return t;
            if (t > 5.0) break;
            t += d * 0.9;
          }
          return -1.0;
        }
        
        vec3 lighting(vec3 p, vec3 rd, float t) {
          if (t < 0.0) return vec3(0.0);
          
          vec3 normal = calcNormal(p);
          vec3 viewDir = -rd;
          vec3 baseColor = uSphereColor;
          vec3 ambient = uLightColor * uAmbientIntensity;
          
          vec3 lightDir = normalize(uLightPosition);
          float diff = max(dot(normal, lightDir), 0.0);
          vec3 diffuse = uLightColor * diff * uDiffuseIntensity;
          
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
          vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
          
          vec3 color = baseColor + ambient + diffuse + specular;
          color = pow(color, vec3(uContrast * 0.9));
          color = color / (color + vec3(0.8));
          
          return color;
        }
        
        float calculateCursorGlow(vec3 worldPos) {
          float dist = length(worldPos.xy - uCursorSphere.xy);
          float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
          return pow(glow, 2.0) * uCursorGlowIntensity;
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
          uv.x *= uResolution.x / uResolution.y;
          
          vec3 ro = vec3(uv * 2.0, -1.0);
          vec3 rd = vec3(0.0, 0.0, 1.0);
          float t = rayMarch(ro, rd);
          vec3 p = ro + rd * t;
          vec3 color = lighting(p, rd, t);
          
          float cursorGlow = calculateCursorGlow(ro);
          vec3 glowContribution = uCursorGlowColor * cursorGlow;
          
          if (t > 0.0) {
            float fogAmount = 1.0 - exp(-t * uFogDensity);
            color = mix(color, uBackgroundColor, fogAmount * 0.3);
            color += glowContribution * 0.3;
            gl_FragColor = vec4(color, 1.0);
          } else {
            if (cursorGlow > 0.01) {
              gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
            } else {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
          }
        }
      `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = material;
    clockRef.current = clock;

    // Mouse handling
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      
      const worldPos = screenToWorldJS(x, y);
      material.uniforms.uCursorSphere.value.copy(worldPos);
      material.uniforms.uMousePosition.value.set(x, y);
      
      setCursorInfo({
        x: worldPos.x.toFixed(2),
        y: worldPos.y.toFixed(2),
        radius: material.uniforms.uCursorRadius.value.toFixed(2),
        merges: 0
      });
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      material.uniforms.uCursorRadius.value = 0.15;
      material.uniforms.uSmoothness.value = 1.2;
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      material.uniforms.uCursorRadius.value = 0.08;
      material.uniforms.uSmoothness.value = 0.8;
    };

    const screenToWorldJS = (normalizedX, normalizedY) => {
      const uv_x = normalizedX * 2.0 - 1.0;
      const uv_y = normalizedY * 2.0 - 1.0;
      const aspect = window.innerWidth / window.innerHeight;
      return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = 1.0 - touch.clientY / window.innerHeight;
        
        const worldPos = screenToWorldJS(x, y);
        material.uniforms.uCursorSphere.value.copy(worldPos);
        material.uniforms.uMousePosition.value.set(x, y);
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      setIsDragging(true);
      material.uniforms.uCursorRadius.value = 0.15;
      material.uniforms.uSmoothness.value = 1.2;
      handleTouchMove(e);
    };

    const handleTouchEnd = (e) => {
      setIsDragging(false);
      material.uniforms.uCursorRadius.value = 0.08;
      material.uniforms.uSmoothness.value = 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentPixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(currentPixelRatio);
      material.uniforms.uResolution.value.set(width, height);
      material.uniforms.uActualResolution.value.set(width * currentPixelRatio, height * currentPixelRatio);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEmailClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@yourname.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projects = [
    {
      title: 'AI-Powered Analytics Platform',
      description: 'Built a real-time analytics dashboard processing 10M+ events daily',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      link: '#'
    },
    {
      title: 'E-Commerce Microservices',
      description: 'Architected scalable microservices handling 50k concurrent users',
      tech: ['Go', 'Kubernetes', 'gRPC', 'MongoDB'],
      link: '#'
    },
    {
      title: 'Mobile Fitness App',
      description: 'Cross-platform app with 100k+ downloads and 4.8★ rating',
      tech: ['React Native', 'Firebase', 'TensorFlow'],
      link: '#'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Metaball Background */}
      <div ref={containerRef} className={styles.metaballBackground} />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            YourName
          </div>
          <div className={styles.navLinks}>
            {['home', 'about', 'projects', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`${styles.navButton} ${
                  activeSection === section ? styles.navButtonActive : ''
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={styles.section}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Full Stack Developer
          </h1>
          <p className={styles.heroSubtitle}>
            Crafting beautiful, performant web experiences that users love
          </p>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => scrollToSection('projects')}
              className={styles.buttonPrimary}
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={styles.buttonSecondary}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`${styles.section} ${styles.sectionWithPadding}`}>
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>
            About Me
          </h2>
          <div className={styles.card}>
            <p className={styles.cardText}>
              I'm a passionate full-stack developer with 5+ years of experience building scalable web applications. 
              I specialize in modern JavaScript frameworks, cloud architecture, and creating intuitive user experiences.
            </p>
            <p className={styles.cardText}>
              When I'm not coding, you'll find me exploring new technologies, contributing to open source, 
              or sharing knowledge through technical writing.
            </p>
            <div className={styles.skillsGrid}>
              {['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'Next.js', 'GraphQL'].map((skill) => (
                <div
                  key={skill}
                  className={styles.skillBadge}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`${styles.section} ${styles.sectionWithPadding}`}>
        <div className={styles.projectsContent}>
          <h2 className={styles.sectionTitle} style={{textAlign: 'center', marginBottom: '3rem'}}>
            Featured Projects
          </h2>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <div
                key={index}
                ref={(el) => (projectRefs.current[index] = el)}
                className={`${styles.projectCard} ${
                  visibleProjects.includes(index) ? styles.projectCardVisible : styles.projectCardHidden
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.techTags}>
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className={styles.techTag}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className={styles.projectLink}
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`${styles.section} ${styles.sectionWithPadding}`}>
        <div className={styles.contactContent}>
          <h2 className={styles.sectionTitle}>
            Let's Connect
          </h2>
          <div className={styles.contactCard}>
            <p className={styles.cardText}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <button
              onClick={handleEmailClick}
              className={styles.emailButton}
            >
              {emailCopied ? '✓ Copied to clipboard!' : 'hello@yourname.com'}
            </button>
            <div className={styles.socialLinks}>
              {[
                { name: 'GitHub', link: '#' },
                { name: 'LinkedIn', link: '#' },
                { name: 'Twitter', link: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  className={styles.socialLink}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 YourName. Built with Next.js & Three.js</p>
      </footer>
    </div>
  );
};

export default Portfolio;