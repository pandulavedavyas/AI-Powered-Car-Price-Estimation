document.addEventListener("DOMContentLoaded", function () {
    // 1. Setup Canvas for Skidmarks and Smoke Particles
    const canvas = document.getElementById("fxCanvas");
    const ctx = canvas.getContext("2d");
    
    // Make canvas full screen
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    
    // Arrays to hold particle and skid data
    let particles = [];
    let skidMarks = [];
    let isDrifting = false;

    // F1 Car coordinates state managed by GSAP
    const carState = {
        x: -400,
        y: window.innerHeight / 2,
        rotation: 0 // Degrees
    };

    // 2. Render Loop implementation
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear entire canvas
        
        // Draw skidmarks
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 0; i < skidMarks.length; i++) {
            const mark = skidMarks[i];
            ctx.beginPath();
            ctx.moveTo(mark.startX, mark.startY);
            ctx.lineTo(mark.endX, mark.endY);
            ctx.lineWidth = mark.width;
            ctx.strokeStyle = `rgba(10, 10, 10, ${mark.alpha})`;
            ctx.stroke();
        }
        ctx.restore();
        
        // Update and draw smoke particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02; // Fading
            p.size += 1.5;  // Expanding smoke
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 150, 150, ${p.life * 0.3})`;
            ctx.fill();
        }
        
        requestAnimationFrame(loop);
    }
    loop(); // Start loop

    // Function to generate smoke particle
    function createSmoke(x, y) {
        // Generate 3-5 particles per call to make it thick
        for(let i=0; i<3; i++){
            particles.push({
                x: x + (Math.random() * 40 - 20),
                y: y + (Math.random() * 40 - 20),
                vx: -2 + Math.random() * -3, // Blow left
                vy: (Math.random() - 0.5) * 2,
                life: 1.0,
                size: Math.random() * 15 + 10
            });
        }
    }

    // Function to draw skid from last pos to new pos
    const tireOffsets = [
        { dx: -100, dy: -40 }, // Rear Left
        { dx: -100, dy: 40 },  // Rear Right
    ];

    let lastSkidPos = null;

    function recordSkid() {
        if (!isDrifting) {
            lastSkidPos = null;
            return;
        }

        // Calculate center position
        const cx = carState.x;
        const cy = carState.y;
        
        const rad = carState.rotation * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const currentSkidPos = tireOffsets.map(t => {
            // Apply rotation matrix
            const rotatedX = t.dx * cos - t.dy * sin;
            const rotatedY = t.dx * sin + t.dy * cos;
            return {
                x: cx + rotatedX,
                y: cy + rotatedY
            };
        });

        // Add skid segments
        if (lastSkidPos) {
            for (let i = 0; i < tireOffsets.length; i++) {
                skidMarks.push({
                    startX: lastSkidPos[i].x,
                    startY: lastSkidPos[i].y,
                    endX: currentSkidPos[i].x,
                    endY: currentSkidPos[i].y,
                    width: 20,
                    alpha: Math.random() * 0.4 + 0.3 // Realism variance
                });
            }
        }

        // Add smoke at rear wheels
        currentSkidPos.forEach(pos => {
            if(Math.random() > 0.2) createSmoke(pos.x, pos.y);
        });

        lastSkidPos = currentSkidPos;
    }

    // 3. GSAP Animation Sequence
    const carDom = document.getElementById("f1Car");
    const overlay = document.getElementById("heroOverlay");
    const brakeLights = document.querySelectorAll(".brake-light");

    // Center coordinates
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create GSAP Timeline
    const tl = gsap.timeline();

    // High Speed Entry (Initial straight burst)
    tl.to(carState, {
        duration: 0.8,
        x: centerX - 300, 
        y: centerY,
        ease: "power2.in",
        onUpdate: function() {
            // Motion blur effect
            gsap.set(carDom, {
                x: carState.x, 
                y: carState.y - 75, // Adjust for center (car is 150 tall)
                rotation: carState.rotation,
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4)) blur(2px)"
            });
        }
    })

    // The Drift (Curve and rotate)
    .to(carState, {
        duration: 2.0,
        x: centerX,
        y: centerY,
        rotation: 40, // Drift angle
        ease: "power3.out", // Decelerate during drift
        onStart: function() {
            isDrifting = true; // Start generating smoke and skids
            // Turn on brake lights
            brakeLights.forEach(el => el.classList.add('active'));
            // Shake effect on canvas
            gsap.to(canvas, { duration: 0.1, x: 5, y: -5, yoyo: true, repeat: 20 });
        },
        onUpdate: function() {
            recordSkid();
            gsap.set(carDom, {
                x: carState.x,
                y: carState.y - 75,
                rotation: carState.rotation,
                // Reduce motion blur as it slows down
                filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.4)) blur(${this.progress() > 0.8 ? 0 : 1}px)`
            });
        },
        onComplete: function() {
            isDrifting = false; 
            // Turn off brake lights slowly
            brakeLights.forEach(el => el.classList.remove('active'));
        }
    })
    
    // Correct position (straighten out slightly to stop)
    .to(carState, {
        duration: 0.8,
        rotation: 0,
        ease: "power2.inOut",
        onUpdate: function() {
            gsap.set(carDom, {
                 x: carState.x,
                 y: carState.y - 75,
                 rotation: carState.rotation
            });
            // Small wheel adjustment smoke
            if(Math.random()<0.2) createSmoke(carState.x - 100, carState.y + 40);
        }
    })

    // 4. Reveal UI Layer smoothly and center the car layout
    .to(carDom, {
        duration: 1.5,
        y: "+=120", // Push car down slightly to make room for text
        ease: "power2.out"
    }, "+=0.2")

    .to(overlay, {
        duration: 1.0,
        opacity: 1,
        pointerEvents: "auto",
        top: '40%', // Shift text slightly up
        ease: "power2.out"
    }, "<"); // Run at the same time as pushing car down

});
