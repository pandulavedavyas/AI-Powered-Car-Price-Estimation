/* Custom Animations JavaScript */

// Add Engine Start Sound Element
const engineAudio = new Audio('https://www.soundjay.com/transportation/sounds/car-start-1.mp3'); 
engineAudio.volume = 0.5;

function playEngineSound() {
    engineAudio.currentTime = 0;
    engineAudio.play().catch(e => console.log('Audio autoplay prevented'));
}

document.addEventListener("DOMContentLoaded", () => {
    // Attach engine sound to all link and button clicks!
    const interactiveEls = document.querySelectorAll("a, button, .decorative-icon");
    interactiveEls.forEach(el => {
        el.addEventListener("click", () => {
            playEngineSound();
        });
    });

    // Register scroll trigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial Hero Animation
    gsap.from(".logo", { duration: 1, y: -50, opacity: 0, ease: "power3.out" });
    gsap.from(".nav-links a", { duration: 1, y: -50, opacity: 0, stagger: 0.1, ease: "power3.out" });
    
    gsap.from(".glitch-text", { duration: 1.5, opacity: 0, scale: 0.9, delay: 0.5, ease: "elastic.out(1, 0.3)" });
    gsap.from(".fade-in-up", { duration: 1, y: 30, opacity: 0, stagger: 0.2, delay: 0.8, ease: "power2.out" });
    
    // Scroll Triggers for content sections
    const leftElements = document.querySelectorAll(".slide-in-left");
    leftElements.forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 80%" }, x: -100, opacity: 0, duration: 1, ease: "power2.out" });
    });

    const rightElements = document.querySelectorAll(".slide-in-right");
    rightElements.forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 80%" }, x: 100, opacity: 0, duration: 1, ease: "power2.out" });
    });

    const upElements = document.querySelectorAll(".slide-in-up");
    upElements.forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 50, opacity: 0, duration: 1, ease: "power2.out" });
    });

    // Accuracy bar animation
    const progressFill = document.querySelector('.progress-fill');
    if(progressFill) {
        ScrollTrigger.create({
            trigger: ".accuracy-bars",
            start: "top 80%",
            onEnter: () => { progressFill.style.width = progressFill.getAttribute('data-target'); }
        });
    }
});

// Create global tracker for smoke emitter
window.trackCarPosition = { x: -100, y: -100 };

// 2. Three.js Background Rendering - DARK NEON GARAGE
function initThreeJS() {
    const canvas = document.getElementById('canvas3d');
    if(!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 12);

    // Alpha true handles transparency to show the Generated Background!
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Dramatic Neon Red light matching background
    const redLight = new THREE.PointLight(0xff003c, 5, 30);
    redLight.position.set(-8, 5, -5);
    scene.add(redLight);

    // Dramatic Neon Blue light matching background
    const blueLight = new THREE.PointLight(0x00d2ff, 5, 30);
    blueLight.position.set(8, 5, 5);
    scene.add(blueLight);
    
    // Top cinematic spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 15, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Floor is completely invisible to let the HTML CSS background shine perfectly through, just acts as shadow catcher
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- CAR MODEL ---
    const carGroup = new THREE.Group();
    scene.add(carGroup);
    
    let carModel;
    const loader = new THREE.GLTFLoader();

    // High performance model
    const modelUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/ferrari.glb';
    
    loader.load(modelUrl, function (gltf) {
        carModel = gltf.scene;
        
        // Center the car pivot
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        
        carModel.position.x = -center.x;
        carModel.position.y = -box.min.y; 
        carModel.position.z = -center.z;
        
        carModel.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Add metallic look
                if(child.material) {
                    child.material.metalness = 0.8;
                    child.material.roughness = 0.2;
                }
            }
        });
        
        carGroup.add(carModel);
        carGroup.position.set(0, 0, -30);

    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- ANIMATION / PHYSICS LOOP ---
    const clock = new THREE.Clock();
    let scrollY = 0;
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        
        // Pulse lights cinematically
        redLight.intensity = 3 + Math.sin(time*2)*2;
        blueLight.intensity = 3 + Math.cos(time*3)*2;

        if (carGroup && carModel) {
            // Speed of the drifting 
            let speed = time * 2.5; // Fast drifting
            
            // Generate full screen sweeping drift path (figure 8)
            let pathX = Math.sin(speed * 0.5) * 12;
            let pathZ = Math.sin(speed) * 6;
            
            carGroup.position.x = pathX;
            carGroup.position.z = pathZ;
            
            let nextX = Math.sin((speed + 0.1) * 0.5) * 12;
            let nextZ = Math.sin(speed + 0.1) * 6;
            
            let angle = Math.atan2(nextX - pathX, nextZ - pathZ);
            
            // Extreme slip angle for intense drift look
            let driftAngle = Math.cos(speed) * 1.5;
            
            carGroup.rotation.y = angle + driftAngle;
            
            // Body roll
            carModel.rotation.z = Math.sin(speed*0.5) * 0.15;
            carModel.rotation.x = Math.sin(speed * 10) * 0.01; 
            
            // Camera dynamics
            camera.position.x = Math.sin(time) * 1.0 + (pathX * 0.1);
            camera.position.y = 3 - (scrollY * 0.005);
            camera.lookAt(pathX, 1, pathZ);

            // Calculate exact screen position of the rear tires for smoke emitter
            let rearPos = new THREE.Vector3(0, 0, -2); // Rear of the car relative to its center pivot
            rearPos.applyMatrix4(carGroup.matrixWorld);
            
            let proj = rearPos.project(camera);
            window.trackCarPosition.x = (proj.x * 0.5 + 0.5) * window.innerWidth;
            window.trackCarPosition.y = -(proj.y * 0.5 - 0.5) * window.innerHeight;
        }

        renderer.render(scene, camera);
    }
    animate();
}

initThreeJS();

// 3. Smoke Particles Canvas (2D) - NIGHT TIRE SMOKE
function initSmoke() {
    const canvas = document.getElementById("smokeCanvas");
    if(!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    const setSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setSize();
    window.addEventListener('resize', setSize);

    let particles = [];
    
    function addParticle() {
        if(!window.trackCarPosition.x || window.trackCarPosition.y < 0) return;
        
        // Spawn right at the tracked wheel position!
        particles.push({
            x: window.trackCarPosition.x + (Math.random() - 0.5) * 40,
            y: window.trackCarPosition.y,
            vx: (Math.random() - 0.5) * 6,
            vy: -(Math.random() * 3 + 1) + 1, // billow upward and trail behind
            size: Math.random() * 20 + 20,
            alpha: Math.random() * 0.5 + 0.2, // denser at start
            // Colors reflecting the red/blue neon
            colorType: Math.random() > 0.5 ? 'red' : 'blue'
        });
    }

    // Heavy tire smoke emitter rate
    setInterval(() => {
        for(let i=0; i<3; i++) addParticle();
    }, 50);

    function draw() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        // Additive blending for neon smoke illuminated by car lights
        ctx.globalCompositeOperation = 'screen';
        
        for(let i=particles.length-1; i>=0; i--) {
            let p = particles[i];
            
            // Swirling motion
            p.x += Math.sin(p.y * 0.01) * 3 + p.vx;
            p.y += p.vy;
            p.vx *= 0.98; // slow down spreading
            
            // Dissipate
            p.alpha -= 0.005;
            p.size += 1.0;
            
            if(p.alpha <= 0 || p.size > 200) {
                particles.splice(i, 1);
                continue;
            }
            
            let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            
            if(p.colorType === 'red') {
                grad.addColorStop(0, `rgba(255, 50, 80, ${p.alpha * 0.5})`);
                grad.addColorStop(1, `rgba(50, 10, 20, 0)`);
            } else {
                grad.addColorStop(0, `rgba(50, 200, 255, ${p.alpha * 0.5})`);
                grad.addColorStop(1, `rgba(10, 30, 50, 0)`);
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
        
        requestAnimationFrame(draw);
    }
    draw();
}

initSmoke();
