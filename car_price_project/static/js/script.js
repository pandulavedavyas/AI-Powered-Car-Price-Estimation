document.addEventListener('DOMContentLoaded', () => {
    
    // Check if we are on the homepage to play intro
    const introOverlay = document.getElementById('introOverlay');
    if (introOverlay) {
        // If coming from another page, we might want to skip the intro or not. 
        // For demonstration, let's play it quickly or if it's the first time.
        // Assuming every home visit plays it.
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            // Optionally remove from DOM
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 1000);
        }, 3000); // 3 seconds for drifting animation
    } else {
        // Just hide immediately on other pages
        if(introOverlay) introOverlay.style.display = 'none';
    }

    // Garage Door Open Animation
    setTimeout(() => {
        const garageDoor = document.querySelector('.garage-door');
        if (garageDoor) {
            garageDoor.classList.add('open');
        }
    }, 100);

    // Car detail thumbnail swapping
    const thumbs = document.querySelectorAll('.thumb');
    const mainImageContent = document.querySelector('.main-image img');
    
    if (thumbs.length && mainImageContent) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImageContent.src = this.src;
                // Add a small animation effect
                mainImageContent.classList.remove('zoom-in');
                void mainImageContent.offsetWidth; // trigger reflow
                mainImageContent.classList.add('zoom-in');
            });
        });
    }

    // Subtle parallax effect on blurred background cars
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const carLeft = document.querySelector('.car-left');
        const carRight = document.querySelector('.car-right');
        
        if (carLeft && carRight) {
            carLeft.style.transform = `perspective(800px) rotateY(15deg) translate(${x * -20}px, ${y * -20}px)`;
            carRight.style.transform = `perspective(800px) rotateY(-15deg) translate(${x * 20}px, ${y * 20}px)`;
        }
    });
});

// To handle smooth transitions across pages
document.addEventListener("click", function(e) {
    if (e.target.tagName.toLowerCase() === 'a') {
        const href = e.target.getAttribute('href');
        // If it's internal link
        if (href && href.startsWith('/')) {
            e.preventDefault();
            const garageDoor = document.querySelector('.garage-door');
            if (garageDoor) {
                garageDoor.classList.remove('open');
                setTimeout(() => {
                    window.location.href = href;
                }, 800); // wait for door to close
            } else {
                window.location.href = href;
            }
        }
    }
});
