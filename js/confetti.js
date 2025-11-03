// Simple confetti animation using canvas
export function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            size: Math.random() * 8 + 4,
            speedY: -(Math.random() * 3 + 3),
            speedX: Math.random() * 6 - 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            gravity: 0.15,
            opacity: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeParticles = 0;
        
        particles.forEach((p, index) => {
            p.speedY += p.gravity;
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            // Fade out near the bottom
            if (p.y > canvas.height - 100) {
                p.opacity -= 0.02;
            }
            
            if (p.opacity > 0 && p.y < canvas.height + 50) {
                activeParticles++;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                
                // Draw rectangle confetti
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                
                ctx.restore();
            }
        });
        
        if (activeParticles > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    
    animate();
}
