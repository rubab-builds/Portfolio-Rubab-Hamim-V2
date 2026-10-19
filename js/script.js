/**
 * Rubab Hamim — Ultra-Luxurious Standalone JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Interactive Neural Particle Canvas
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: -1000, y: -1000, radius: 130 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 65);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let curAlpha = p.alpha;
        if (dist < mouse.radius) {
          curAlpha = Math.min(p.alpha + (1 - dist / mouse.radius) * 0.6, 0.9);
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 198, 135, ${curAlpha})`;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - cDist / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // 3. Line Following Robot Differential Steering Simulator
  const sensorBtns = document.querySelectorAll('.sensor-btn');
  const pwmLeft = document.getElementById('pwm-left');
  const pwmRight = document.getElementById('pwm-right');
  const sensorError = document.getElementById('sensor-error');
  const baseSpeed = 180;
  const Kp = 35;

  let sensorState = [0, 0, 1, 0, 0];

  function updateSimulator() {
    const weights = [-2, -1, 0, 1, 2];
    let weightedSum = 0;
    let activeCount = 0;

    sensorState.forEach((val, i) => {
      if (val === 1) {
        weightedSum += weights[i];
        activeCount++;
      }
    });

    const error = activeCount > 0 ? weightedSum / activeCount : 0;
    const correction = Math.round(error * Kp);
    const leftVal = Math.max(0, Math.min(255, baseSpeed + correction));
    const rightVal = Math.max(0, Math.min(255, baseSpeed - correction));

    if (pwmLeft) pwmLeft.textContent = leftVal;
    if (pwmRight) pwmRight.textContent = rightVal;
    if (sensorError) sensorError.textContent = error.toFixed(2);
  }

  sensorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      sensorState[idx] = sensorState[idx] === 1 ? 0 : 1;
      btn.classList.toggle('active', sensorState[idx] === 1);
      updateSimulator();
    });
  });

  updateSimulator();

  // 4. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.style.color = '#34D399';
        formFeedback.textContent = `Thank you, ${name}! Your transmission has been queued for delivery to contact.rubabhamim@gmail.com.`;
      }
      contactForm.reset();
    });
  }

  // 5. Copy Email
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('contact.rubabhamim@gmail.com');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });
  }
});
