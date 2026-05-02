import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * BioCoreSphere
 * A WebGL "bio-core": a dark organic sphere with cracked metal surface,
 * glowing internal veins, and outward energy tendrils. Reacts to mouse movement
 * with subtle distortion, slow rotation and parallax.
 */
export default function BioCoreSphere() {
    const mountRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, proximity: 0, tProx: 0 });

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // --- Mobile fallback: skip WebGL, show static image ---
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x05070b, 0.08);

        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 0, 5.2);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);

        // --- Shared uniforms ---
        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uProximity: { value: 0 },
            uColorA: { value: new THREE.Color(0x1a2a6c) }, // deep blue
            uColorB: { value: new THREE.Color(0x6a00ff) }, // secondary glow purple
            uColorBase: { value: new THREE.Color(0x0a0e18) },
        };

        // --- Bio-core sphere (cracked metal + glowing veins) ---
        const sphereGeo = new THREE.IcosahedronGeometry(1.35, 64);
        const sphereMat = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform float uProximity;
                varying vec3 vNormal;
                varying vec3 vPos;
                varying float vDisp;

                // Simplex-ish noise (cheap hash noise)
                vec3 hash3(vec3 p){
                    p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                              dot(p,vec3(269.5,183.3,246.1)),
                              dot(p,vec3(113.5,271.9,124.6)));
                    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
                }
                float noise(vec3 p){
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    vec3 u = f*f*(3.0-2.0*f);
                    return mix( mix( mix( dot(hash3(i+vec3(0,0,0)), f-vec3(0,0,0)),
                                          dot(hash3(i+vec3(1,0,0)), f-vec3(1,0,0)), u.x),
                                     mix( dot(hash3(i+vec3(0,1,0)), f-vec3(0,1,0)),
                                          dot(hash3(i+vec3(1,1,0)), f-vec3(1,1,0)), u.x), u.y),
                                mix( mix( dot(hash3(i+vec3(0,0,1)), f-vec3(0,0,1)),
                                          dot(hash3(i+vec3(1,0,1)), f-vec3(1,0,1)), u.x),
                                     mix( dot(hash3(i+vec3(0,1,1)), f-vec3(0,1,1)),
                                          dot(hash3(i+vec3(1,1,1)), f-vec3(1,1,1)), u.x), u.y), u.z);
                }
                float fbm(vec3 p){
                    float v = 0.0;
                    float a = 0.5;
                    for(int i=0;i<5;i++){
                        v += a * noise(p);
                        p *= 2.02;
                        a *= 0.5;
                    }
                    return v;
                }

                void main(){
                    vNormal = normalize(normalMatrix * normal);
                    vec3 p = position;
                    float t = uTime * 0.22;
                    // organic surface noise (more dramatic)
                    float n = fbm(p * 1.8 + vec3(0.0, t, 0.0));
                    float n2 = fbm(p * 3.4 - vec3(t*0.5, 0.0, 0.0));
                    // mouse-based distortion ripple — MORE responsive
                    float mDist = length(uMouse);
                    float mShape = smoothstep(0.0, 1.2, mDist);
                    // directional ripple emanating from cursor vector
                    float wave = sin(dot(p, vec3(uMouse.x, uMouse.y, 0.6)) * 4.0 + t * 2.6) * 0.08 * mShape;
                    float wave2 = sin(dot(p, vec3(-uMouse.y, uMouse.x, 0.3)) * 6.0 + t * 1.8) * 0.04 * mShape;
                    float disp = n * 0.22 + n2 * 0.08 + wave + wave2 + uProximity * 0.06;
                    vDisp = disp;
                    vec3 displaced = p + normal * disp;
                    vPos = displaced;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform float uProximity;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform vec3 uColorBase;
                varying vec3 vNormal;
                varying vec3 vPos;
                varying float vDisp;

                // Hash noise again (scoped for fragment)
                vec3 hash3(vec3 p){
                    p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                              dot(p,vec3(269.5,183.3,246.1)),
                              dot(p,vec3(113.5,271.9,124.6)));
                    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
                }
                float noise(vec3 p){
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    vec3 u = f*f*(3.0-2.0*f);
                    return mix( mix( mix( dot(hash3(i+vec3(0,0,0)), f-vec3(0,0,0)),
                                          dot(hash3(i+vec3(1,0,0)), f-vec3(1,0,0)), u.x),
                                     mix( dot(hash3(i+vec3(0,1,0)), f-vec3(0,1,0)),
                                          dot(hash3(i+vec3(1,1,0)), f-vec3(1,1,0)), u.x), u.y),
                                mix( mix( dot(hash3(i+vec3(0,0,1)), f-vec3(0,0,1)),
                                          dot(hash3(i+vec3(1,0,1)), f-vec3(1,0,1)), u.x),
                                     mix( dot(hash3(i+vec3(0,1,1)), f-vec3(0,1,1)),
                                          dot(hash3(i+vec3(1,1,1)), f-vec3(1,1,1)), u.x), u.y), u.z);
                }
                float fbm(vec3 p){
                    float v=0.0; float a=0.5;
                    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; }
                    return v;
                }

                // Cracks / veins: ridged noise
                float ridged(vec3 p){
                    float n = fbm(p);
                    return 1.0 - abs(n);
                }

                void main(){
                    vec3 N = normalize(vNormal);
                    vec3 V = normalize(cameraPosition - vPos);
                    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);

                    // Metal surface base: layered, more textured
                    float surf1 = fbm(vPos * 4.2 + vec3(0.0, uTime*0.05, 0.0));
                    float surf2 = fbm(vPos * 8.5 + vec3(uTime*0.03, 0.0, 0.0));
                    vec3 metal = mix(vec3(0.010, 0.014, 0.022), vec3(0.038, 0.048, 0.072), smoothstep(-0.3, 0.8, surf1));
                    metal += vec3(0.018, 0.024, 0.040) * smoothstep(0.2, 0.7, surf2);
                    // Dark cracked patches
                    float darkPatch = smoothstep(0.15, 0.55, fbm(vPos * 5.5));
                    metal *= (1.0 - darkPatch * 0.45);

                    // FLUID DOMAIN WARP: offset sample point by another fbm for marbled flow
                    vec3 warp = vec3(
                        fbm(vPos * 1.6 + vec3(uTime * 0.06, 0.0, 0.0)),
                        fbm(vPos * 1.6 + vec3(0.0, uTime * 0.05, 0.0)),
                        fbm(vPos * 1.6 + vec3(0.0, 0.0, uTime * 0.04))
                    );
                    vec3 wPos = vPos + warp * 0.18;

                    // PRIMARY VEINS: thin glowing zero-crossing bands of warped noise
                    float n1 = fbm(wPos * 1.9 + vec3(uTime*0.04, 0.0, 0.0));
                    float veins = 1.0 - smoothstep(0.0, 0.045, abs(n1));
                    // Secondary medium veins
                    float n1b = fbm(wPos * 3.0 + vec3(0.0, uTime*0.06, 0.0));
                    float veinsB = (1.0 - smoothstep(0.0, 0.026, abs(n1b))) * 0.8;
                    // Fine micro-veins
                    float n2 = fbm(wPos * 5.5);
                    float microVeins = (1.0 - smoothstep(0.0, 0.015, abs(n2))) * 0.55;
                    // Hairline cracks (very tight)
                    float n3 = fbm(wPos * 9.0);
                    float hairline = (1.0 - smoothstep(0.0, 0.009, abs(n3))) * 0.35;

                    // Glow color: blend blue -> purple based on low-freq noise
                    float colMix = fbm(vPos * 1.0 + vec3(uTime*0.04));
                    vec3 glowCol = mix(uColorA, uColorB, smoothstep(-0.3, 0.55, colMix));
                    // Boost overall vein luminance
                    glowCol *= 1.6;
                    // Mouse proximity shifts color toward purple
                    glowCol = mix(glowCol, uColorB * 1.8, uProximity * 0.4);

                    // Combine — slightly toned down for less dominance
                    vec3 col = metal;
                    col += glowCol * veins * (1.7 + uProximity * 1.2);
                    col += glowCol * veinsB * (1.05 + uProximity * 0.5);
                    col += glowCol * microVeins * 0.7;
                    col += glowCol * hairline * 0.4;
                    // Rim light
                    col += fres * mix(uColorA, uColorB, 0.6) * (0.35 + uProximity * 0.3);
                    // Pulse along primary veins
                    float pulse = 0.5 + 0.5 * sin(uTime * 1.1);
                    col += glowCol * veins * 0.35 * pulse;
                    // Displacement-based highlight (cursor ripples glow more)
                    col += glowCol * max(vDisp, 0.0) * 0.9;

                    gl_FragColor = vec4(col, 1.0);
                }
            `,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);

        // --- Inner core: small glowing orb inside for depth ---
        const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
        const coreMat = new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPos;
                void main(){
                    vNormal = normalize(normalMatrix * normal);
                    vPos = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform float uProximity;
                varying vec3 vNormal;
                varying vec3 vPos;
                void main(){
                    vec3 V = normalize(cameraPosition - vPos);
                    float fres = pow(1.0 - max(dot(normalize(vNormal), V), 0.0), 1.4);
                    float pulse = 0.6 + 0.4 * sin(uTime * 1.3);
                    vec3 col = mix(uColorA, uColorB, 0.5 + 0.5*sin(uTime*0.4)) * fres * (0.9 + uProximity*0.4) * pulse;
                    gl_FragColor = vec4(col, fres * 0.45);
                }
            `,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // --- Tendrils: live, writhing, micro-organism-like strands ---
        // Use animated Line geometries; positions update every frame.
        const tendrilsGroup = new THREE.Group();
        const TENDRILS = 6;
        const TEND_SEGS = 64;
        const tendrilState = []; // per-tendril params + line refs

        for (let i = 0; i < TENDRILS; i++) {
            const dir = new THREE.Vector3(
                Math.random() * 2 - 1,
                (Math.random() * 2 - 1) * 0.55,
                Math.random() * 2 - 1
            ).normalize();
            const up = Math.abs(dir.y) < 0.9
                ? new THREE.Vector3(0, 1, 0)
                : new THREE.Vector3(1, 0, 0);
            const sideA = new THREE.Vector3().crossVectors(dir, up).normalize();
            const sideB = new THREE.Vector3().crossVectors(dir, sideA).normalize();

            const state = {
                dir,
                sideA,
                sideB,
                length: 0.65 + Math.random() * 0.7,
                seed: Math.random() * 100,
                freqA: 2.4 + Math.random() * 1.4,
                freqB: 1.6 + Math.random() * 1.0,
                ampA: 0.10 + Math.random() * 0.06,
                ampB: 0.08 + Math.random() * 0.05,
                speed: 0.7 + Math.random() * 0.4,
                lines: [],
            };

            // Two layered lines per tendril for thickness illusion (additive)
            const layers = [
                { offset: 0.0, opacity: 0.95, hue: 0.5 },
                { offset: 0.012, opacity: 0.55, hue: 0.85 },
                { offset: -0.012, opacity: 0.55, hue: 0.15 },
            ];

            layers.forEach((layer) => {
                const positions = new Float32Array(TEND_SEGS * 3);
                const tArr = new Float32Array(TEND_SEGS);
                for (let s = 0; s < TEND_SEGS; s++) tArr[s] = s / (TEND_SEGS - 1);

                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
                geo.setAttribute("aT", new THREE.BufferAttribute(tArr, 1));

                const mat = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: uniforms.uTime,
                        uColorA: uniforms.uColorA,
                        uColorB: uniforms.uColorB,
                        uProximity: uniforms.uProximity,
                        uSeed: { value: state.seed + layer.offset * 100 },
                        uHue: { value: layer.hue },
                        uOpacity: { value: layer.opacity },
                    },
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    vertexShader: `
                        attribute float aT;
                        varying float vT;
                        void main(){
                            vT = aT;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                        }
                    `,
                    fragmentShader: `
                        precision highp float;
                        uniform float uTime;
                        uniform vec3 uColorA;
                        uniform vec3 uColorB;
                        uniform float uSeed;
                        uniform float uHue;
                        uniform float uOpacity;
                        uniform float uProximity;
                        varying float vT;
                        void main(){
                            // Fade in at root, fade out at tip; never quite reach tip end
                            float head = smoothstep(0.0, 0.05, vT);
                            float tail = 1.0 - smoothstep(0.55, 1.0, vT);
                            float fade = head * tail;
                            // Travelling pulse along the strand
                            float pulse = 0.45 + 0.55 * sin(uTime*1.6 + uSeed + vT*9.0);
                            vec3 col = mix(uColorA, uColorB, clamp(uHue + vT*0.5, 0.0, 1.0)) * 1.9;
                            float intensity = (0.25 + 0.65*pulse) * (1.0 + uProximity*0.6);
                            gl_FragColor = vec4(col * intensity, fade * uOpacity);
                        }
                    `,
                });

                const line = new THREE.Line(geo, mat);
                line.frustumCulled = false;
                tendrilsGroup.add(line);
                state.lines.push({ line, geo, layerOffset: layer.offset });
            });

            tendrilState.push(state);
        }
        scene.add(tendrilsGroup);

        // --- Halo: faint pulsing energy ring around the sphere ---
        const haloGeo = new THREE.RingGeometry(1.6, 2.05, 128, 1);
        const haloMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: uniforms.uTime,
                uColorA: uniforms.uColorA,
                uColorB: uniforms.uColorB,
                uProximity: uniforms.uProximity,
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vWPos;
                void main(){
                    vUv = uv;
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWPos = wp.xyz;
                    gl_Position = projectionMatrix * viewMatrix * wp;
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform float uProximity;
                varying vec2 vUv;
                varying vec3 vWPos;
                void main(){
                    // Radial distance from ring center on UV
                    vec2 c = vUv - 0.5;
                    float r = length(c) * 2.0; // 0..1 across ring radius
                    // Concentrate intensity at inner edge of ring
                    float band = 1.0 - smoothstep(0.0, 1.0, abs(r - 0.55) * 4.0);
                    // Angular shimmer
                    float ang = atan(c.y, c.x);
                    float shimmer = 0.55 + 0.45 * sin(ang * 6.0 + uTime * 0.6);
                    float pulse = 0.55 + 0.45 * sin(uTime * 0.8);
                    vec3 col = mix(uColorA, uColorB, 0.55 + 0.45 * sin(uTime * 0.3));
                    float intensity = band * shimmer * pulse * (0.55 + uProximity * 0.5);
                    gl_FragColor = vec4(col * 1.6 * intensity, intensity * 0.85);
                }
            `,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2; // face camera-ish, will billboard each frame
        scene.add(halo);

        // Outer faint glow disc (very soft)
        const haloGeo2 = new THREE.RingGeometry(2.0, 3.0, 96, 1);
        const haloMat2 = new THREE.ShaderMaterial({
            uniforms: {
                uTime: uniforms.uTime,
                uColorA: uniforms.uColorA,
                uColorB: uniforms.uColorB,
                uProximity: uniforms.uProximity,
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            vertexShader: `
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform float uProximity;
                varying vec2 vUv;
                void main(){
                    vec2 c = vUv - 0.5;
                    float r = length(c) * 2.0;
                    float fall = 1.0 - smoothstep(0.0, 1.0, r);
                    float pulse = 0.55 + 0.45 * sin(uTime * 0.45);
                    vec3 col = mix(uColorA, uColorB, 0.5);
                    gl_FragColor = vec4(col * 0.9, fall * pulse * 0.18 * (0.6 + uProximity*0.4));
                }
            `,
        });
        const halo2 = new THREE.Mesh(haloGeo2, haloMat2);
        scene.add(halo2);

        // tiny noise function for tendril breathing motion (CPU side)
        const cpuNoise = (x) => {
            const s = Math.sin(x * 12.9898) * 43758.5453;
            return s - Math.floor(s);
        };

        // --- Deep space backdrop: layered nebula + starfield ---
        // Far-back nebula plane (volumetric-ish via fbm)
        const nebGeo = new THREE.PlaneGeometry(60, 36);
        const nebMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: uniforms.uTime,
                uColorA: uniforms.uColorA,
                uColorB: uniforms.uColorB,
                uMouse: uniforms.uMouse,
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform vec2 uMouse;
                varying vec2 vUv;

                vec3 hash3(vec3 p){
                    p = vec3(dot(p,vec3(127.1,311.7,74.7)),
                             dot(p,vec3(269.5,183.3,246.1)),
                             dot(p,vec3(113.5,271.9,124.6)));
                    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
                }
                float noise(vec3 p){
                    vec3 i = floor(p); vec3 f = fract(p);
                    vec3 u = f*f*(3.0-2.0*f);
                    return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),
                                       dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                                   mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),
                                       dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
                               mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),
                                       dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                                   mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),
                                       dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
                }
                float fbm(vec3 p){
                    float v=0.0; float a=0.5;
                    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.05; a*=0.5; }
                    return v;
                }

                void main(){
                    vec2 p = (vUv - 0.5);
                    p.x *= 1.7; // aspect
                    // Slow drifting nebula clouds (domain warp)
                    vec3 q = vec3(p * 1.6, uTime * 0.015);
                    vec3 warp = vec3(fbm(q + 1.7), fbm(q + 9.2), 0.0);
                    float n = fbm(q + warp * 0.8);
                    float n2 = fbm(q * 2.4 + warp * 1.3 + 5.0);

                    // Distance from center - vignette toward edges
                    float r = length(p);
                    float radial = 1.0 - smoothstep(0.0, 0.95, r);

                    // Two cloud layers - blue base + purple highlights
                    vec3 colA = uColorA * 0.55; // deep blue
                    vec3 colB = uColorB * 0.45; // purple
                    vec3 neb = colA * smoothstep(0.0, 0.7, n) * 0.55;
                    neb += colB * smoothstep(0.4, 0.9, n2) * 0.45;
                    // Concentrate around center for depth
                    neb *= (0.35 + radial * 1.4);
                    // Subtle parallax shift
                    neb *= (0.85 + 0.15 * sin(p.x * 3.0 + uTime * 0.1));
                    // Output as additive layer (alpha = brightness so dark areas show stars behind)
                    float a = clamp(length(neb) * 2.5, 0.0, 1.0);
                    gl_FragColor = vec4(neb * 1.4, a);
                }
            `,
        });
        const nebula = new THREE.Mesh(nebGeo, nebMat);
        nebula.position.z = -14;
        scene.add(nebula);

        // Starfield: many tiny points at varying depths for parallax
        const starCount = 1800;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        const starSize = new Float32Array(starCount);
        const starHue = new Float32Array(starCount);
        for (let i = 0; i < starCount; i++) {
            // Spread in a deep box behind the sphere — keep all stars far back
            const z = -8 - Math.pow(Math.random(), 1.6) * 22; // -8 .. -30
            const spread = 18 + Math.abs(z) * 1.4;
            starPos[i * 3] = (Math.random() - 0.5) * spread;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
            starPos[i * 3 + 2] = z;
            // Most stars tiny pinpricks, very few slightly larger
            starSize[i] = 0.35 + Math.pow(Math.random(), 2.5) * 1.4;
            // hue mix bias: blue (0) <-> purple (1)
            starHue[i] = Math.random();
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
        starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
        starGeo.setAttribute("aHue", new THREE.BufferAttribute(starHue, 1));

        const starMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: uniforms.uTime,
                uColorA: uniforms.uColorA,
                uColorB: uniforms.uColorB,
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                attribute float aSize;
                attribute float aHue;
                uniform float uTime;
                uniform float uPixelRatio;
                varying float vHue;
                varying float vTwinkle;
                void main(){
                    vHue = aHue;
                    // Twinkle per-star
                    vTwinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aHue*2.0) + aHue * 17.0);
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mv;
                    // attenuate point size by depth; keep small
                    gl_PointSize = aSize * uPixelRatio * (60.0 / -mv.z);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                varying float vHue;
                varying float vTwinkle;
                void main(){
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv);
                    float core = smoothstep(0.5, 0.05, d);
                    float halo = smoothstep(0.5, 0.2, d) * 0.18;
                    vec3 col = mix(uColorA * 1.5, uColorB * 1.3, vHue);
                    col = mix(col, vec3(0.85, 0.88, 1.0), 0.55);
                    float intensity = (core + halo) * vTwinkle;
                    if(intensity < 0.03) discard;
                    gl_FragColor = vec4(col * intensity, intensity * 0.9);
                }
            `,
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // --- Subtle particle dust around sphere ---
        const pCount = 220;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            const r = 1.8 + Math.random() * 1.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i * 3 + 2] = r * Math.cos(phi);
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.012,
            color: 0x6a00ff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        // --- Lighting (ambient only - we use shader-based lighting) ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        // Initial mouse easing values: start with a mild proximity so sphere isn't completely cold on load
        mouseRef.current.proximity = 0.15;
        mouseRef.current.tProx = 0.15;

        // --- Mouse interaction ---
        const onMouseMove = (e) => {
            const rect = mount.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            mouseRef.current.tx = nx;
            mouseRef.current.ty = ny;
            const dx = nx;
            const dy = ny;
            const dist = Math.sqrt(dx * dx + dy * dy);
            mouseRef.current.tProx = Math.max(0, 1.0 - Math.min(dist, 1.0));
        };
        window.addEventListener("mousemove", onMouseMove, { passive: true });

        // --- Resize ---
        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        // --- Render loop ---
        const clock = new THREE.Clock();
        let frameId;
        const baseCamZ = 5.2;
        const animate = () => {
            const dt = clock.getDelta();
            const t = clock.getElapsedTime();
            uniforms.uTime.value = t;

            // Smooth mouse easing (heavy, controlled)
            const m = mouseRef.current;
            m.x += (m.tx - m.x) * 0.05;
            m.y += (m.ty - m.y) * 0.05;
            m.proximity += (m.tProx - m.proximity) * 0.06;
            uniforms.uMouse.value.set(m.x, m.y);
            uniforms.uProximity.value = m.proximity;

            // Slow, heavy rotation
            sphere.rotation.y += dt * 0.09;
            sphere.rotation.x = m.y * 0.22;
            sphere.rotation.z = m.x * 0.10;

            tendrilsGroup.rotation.y -= dt * 0.03;
            tendrilsGroup.rotation.x = m.y * 0.10;

            particles.rotation.y += dt * 0.02;

            // Animate tendril vertices each frame for biological/writhing feel
            for (let i = 0; i < tendrilState.length; i++) {
                const s = tendrilState[i];
                // Mouse pull: tendrils on the cursor side bend slightly toward it
                const mouseVec = new THREE.Vector3(m.x, m.y, 0);
                const pull = s.dir.dot(mouseVec) * 0.5; // -1..1
                for (let li = 0; li < s.lines.length; li++) {
                    const lineEntry = s.lines[li];
                    const arr = lineEntry.geo.attributes.position.array;
                    for (let p = 0; p < TEND_SEGS; p++) {
                        const tt = p / (TEND_SEGS - 1);
                        const r = 1.36 + tt * s.length;
                        // Multiple sine layers for organic motion
                        const wave1 = Math.sin(t * s.speed * 1.6 + s.seed + tt * s.freqA) * s.ampA * tt;
                        const wave2 = Math.cos(t * s.speed * 1.1 + s.seed * 1.7 + tt * s.freqB) * s.ampB * tt;
                        // Mouse-driven pull bends tendril
                        const mouseBend = pull * 0.18 * tt * tt + m.proximity * 0.06 * tt;
                        // Layer offset shifts position perpendicular for thickness
                        const off = lineEntry.layerOffset;
                        const localA = wave1 + mouseBend + off;
                        const localB = wave2 + off * 0.6;
                        // Compose
                        const px = s.dir.x * r + s.sideA.x * localA + s.sideB.x * localB;
                        const py = s.dir.y * r + s.sideA.y * localA + s.sideB.y * localB;
                        const pz = s.dir.z * r + s.sideA.z * localA + s.sideB.z * localB;
                        arr[p * 3] = px;
                        arr[p * 3 + 1] = py;
                        arr[p * 3 + 2] = pz;
                    }
                    lineEntry.geo.attributes.position.needsUpdate = true;
                }
            }

            // Halo billboard toward camera
            halo.lookAt(camera.position);
            halo2.lookAt(camera.position);
            // Slow halo breathing rotation
            halo.rotation.z += dt * 0.04;
            halo2.rotation.z -= dt * 0.02;

            // Camera dolly: slowly move toward/away based on cursor proximity
            const targetZ = baseCamZ - m.proximity * 0.6;
            camera.position.z += (targetZ - camera.position.z) * 0.025;
            // Parallax depth on camera
            camera.position.x += (m.x * 0.45 - camera.position.x) * 0.035;
            camera.position.y += (m.y * 0.30 - camera.position.y) * 0.035;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            if (renderer.domElement && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            sphereGeo.dispose();
            sphereMat.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            pGeo.dispose();
            pMat.dispose();
            tendrilsGroup.traverse((o) => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) o.material.dispose();
            });
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            data-testid="biocore-canvas"
            className="absolute inset-0"
            style={{
                backgroundImage:
                    "radial-gradient(ellipse at 65% 50%, rgba(26,42,108,0.10), transparent 60%), radial-gradient(ellipse at 68% 55%, rgba(106,0,255,0.06), transparent 65%)",
            }}
        >
            {/* Mobile fallback static image */}
            <div
                className="md:hidden absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
            >
                <div
                    className="w-[70vw] h-[70vw] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle at 40% 40%, rgba(106,0,255,0.55), rgba(26,42,108,0.6) 40%, #0a0e18 70%, #05070b 100%)",
                        boxShadow:
                            "0 0 120px 10px rgba(106,0,255,0.25), inset 0 0 80px rgba(26,42,108,0.6)",
                        filter: "contrast(1.1)",
                    }}
                />
            </div>
        </div>
    );
}
