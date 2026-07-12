export const sketchKey = "freeFall";
export const sketchLabel = "Free Fall";
export const sketch = freeFallSketch;

function freeFallSketch(p, configRef) {
    let x = 300;
    let y = 50;
    let vx = 0;
    let vy = 0;

    let windTime = 0;
    let bounceCount = 0;
    let trail = [];
    const MAX_TRAIL = 40;

    let gravity = 9.8;
    let mass = 1;
    let damping = 0.85;
    let airResistance = 0.02;
    let windStrength = 0.3;
    let springStiffness = 0.3;
    let groundY = 570;

    let isResting = false;
    let restTimer = 0;
    let lastImpactSpeed = 0;

    let ballColor = { r: 100, g: 180, b: 255 };
    let trailColor = { r: 100, g: 180, b: 255 };

    let particles = [];
    let ripples = [];

    const objectPresets = {
        bowling: { mass: 5.0, damping: 0.3, airResistance: 0.005, color: { r: 40, g: 40, b: 45 } },
        rubber: { mass: 1.0, damping: 0.85, airResistance: 0.02, color: { r: 255, g: 60, b: 60 } },
        feather: { mass: 0.1, damping: 0.1, airResistance: 0.15, color: { r: 240, g: 240, b: 245 } }
    };

    p.setup = () => {
        p.createCanvas(800, 600);
        p.frameRate(60);
        vx = p.random(-2, 2);
    };

    function spawnDebris(cx, cy, speed, count) {
        const n = p.min(count, 20);
        for (let i = 0; i < n; i++) {
            const angle = p.radians(p.random(-80, -10));
            const spd = p.random(1, speed * 0.8);
            particles.push({
                x: cx + p.random(-10, 10),
                y: cy + p.random(-5, 5),
                vx: p.cos(angle) * spd * p.random(0.5, 1.5),
                vy: p.sin(angle) * spd * p.random(0.5, 1.5),
                life: 1,
                decay: p.random(0.015, 0.035),
                size: p.random(2, 5),
                color: { r: ballColor.r + p.random(-30, 30), g: ballColor.g + p.random(-30, 30), b: ballColor.b + p.random(-30, 30) }
            });
        }
    }

    function spawnRipple(cx, impactSpeed) {
        ripples.push({
            x: cx,
            y: groundY,
            radius: 0,
            maxRadius: p.map(impactSpeed, 1, 15, 30, 150),
            life: 1,
            speed: p.map(impactSpeed, 1, 15, 1, 4)
        });
    }

    p.draw = () => {
        const config = configRef.current;
        if (config) {
            gravity = config.gravity ?? 9.8;
            windStrength = config.windStrength ?? 0.3;
            springStiffness = config.springStiffness ?? 0.3;

            if (config.objectType && objectPresets[config.objectType]) {
                const preset = objectPresets[config.objectType];
                mass = preset.mass;
                damping = preset.damping;
                airResistance = preset.airResistance;
                ballColor = { ...preset.color };
                trailColor = { ...preset.color };
            } else {
                mass = config.mass ?? 1;
                damping = config.damping ?? 0.85;
                airResistance = config.airResistance ?? 0.02;

                if (config.color) {
                    const colorParts = config.color.split(',').map(Number);
                    if (colorParts.length === 3) {
                        ballColor = { r: colorParts[0], g: colorParts[1], b: colorParts[2] };
                        trailColor = { ...ballColor };
                    }
                }
            }
        }

        p.background(15, 18, 25);

        let speed = p.sqrt(vx * vx + vy * vy);

        windTime += 0.01;
        let windForce = p.noise(windTime) * windStrength * 2 - windStrength;
        let gust = p.noise(windTime * 0.5) > 0.7 ? 2 : 1;
        windForce *= gust;

        let dragX = -vx * airResistance * speed;
        let dragY = -vy * airResistance * speed;

        let gravityVariation = 1 + p.noise(windTime + 100) * 0.02;
        let effectiveGravity = gravity * gravityVariation;
        vy += effectiveGravity * 0.05;

        vx += windForce * 0.05;
        vx += dragX * 0.1;
        vy += dragY * 0.1;

        vx *= 0.999;
        vy *= 0.999;

        x += vx;
        y += vy;

        if (y >= groundY) {
            let penetration = y - groundY;
            let springForce = -springStiffness * penetration;
            vy += springForce * 0.1;
            vy *= damping;
            vx *= 0.98;
            y = groundY + penetration * 0.1;

            if (Math.abs(vy) > 1 && lastImpactSpeed === 0) {
                lastImpactSpeed = Math.abs(vy);
                spawnDebris(x, groundY, lastImpactSpeed, Math.floor(lastImpactSpeed * 2));
                spawnRipple(x, lastImpactSpeed);
            } else if (Math.abs(vy) > 1) {
                lastImpactSpeed = Math.abs(vy);
            }

            if (Math.abs(vy) < 0.1 && penetration < 1) {
                isResting = true;
                restTimer++;
                y += p.noise(restTimer * 0.1) * 0.05;
            } else {
                isResting = false;
                restTimer = 0;
                if (Math.abs(vy) > 0.5) {
                    bounceCount++;
                }
            }
        } else {
            isResting = false;
            restTimer = 0;
            if (lastImpactSpeed > 0 && speed < 0.5) {
                lastImpactSpeed = 0;
            }
        }

        const wallPadding = 20;
        if (x < wallPadding) {
            let force = -(x - wallPadding) * 0.1;
            vx += force;
            x = wallPadding + (x - wallPadding) * 0.1;
        } else if (x > p.width - wallPadding) {
            let force = -(x - (p.width - wallPadding)) * 0.1;
            vx += force;
            x = p.width - wallPadding + (x - (p.width - wallPadding)) * 0.1;
        }

        let sizeVariation = 1 + p.noise(windTime + 200) * 0.05;
        let baseSize = p.map(mass, 0.5, 5, 15, 50);
        let currentSize = baseSize * sizeVariation;

        let squish = 1;
        let stretch = 1;
        let speedFactor = Math.min(speed / 5, 1);

        if (Math.abs(vy) > 1 && y >= groundY - 10) {
            let impactForce = Math.min(Math.abs(vy) / 10, 1);
            squish = 1 + impactForce * 0.2;
            stretch = 1 - impactForce * 0.15;
        } else if (speed > 1) {
            squish = 1 + speedFactor * 0.05;
            stretch = 1 - speedFactor * 0.04;
        }

        // --- PARTICLES ---
        for (let i = particles.length - 1; i >= 0; i--) {
            const pt = particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.15;
            pt.vx *= 0.98;
            pt.life -= pt.decay;
            if (pt.life <= 0 || pt.y > groundY) {
                particles.splice(i, 1);
                continue;
            }
            p.noStroke();
            p.fill(pt.color.r, pt.color.g, pt.color.b, pt.life * 200);
            p.ellipse(pt.x, pt.y, pt.size * pt.life, pt.size * pt.life);
        }

        // --- RIPPLES ---
        for (let i = ripples.length - 1; i >= 0; i--) {
            const rp = ripples[i];
            rp.radius += rp.speed;
            rp.life = 1 - (rp.radius / rp.maxRadius);
            if (rp.life <= 0) {
                ripples.splice(i, 1);
                continue;
            }
            p.noFill();
            p.stroke(ballColor.r, ballColor.g, ballColor.b, rp.life * 80);
            p.strokeWeight(1.5 - rp.life);
            p.ellipse(rp.x, rp.y, rp.radius * 2, rp.radius * 0.3);
        }

        // --- TRAIL ---
        trail.push({ x: x, y: y, size: currentSize, speed: speed });
        if (trail.length > MAX_TRAIL) trail.shift();

        trail.forEach((pos, i) => {
            let alpha = (i / trail.length) * 80;
            let trailSize = currentSize * (0.1 + 0.6 * (i / trail.length));
            p.fill(trailColor.r, trailColor.g, trailColor.b, alpha);
            p.noStroke();
            p.ellipse(pos.x, pos.y, trailSize, trailSize);
        });

        // --- SPEED LINES ---
        if (speed > 3 && y < groundY - 20) {
            let lineAlpha = p.map(speed, 3, 10, 20, 80);
            p.stroke(255, 255, 255, lineAlpha);
            p.strokeWeight(1);
            for (let i = 0; i < 3; i++) {
                let lx = x + p.random(-15, 15);
                let ly = y + p.random(-10, 10);
                let len = p.map(speed, 3, 10, 5, 20);
                let angle = Math.atan2(vy, vx) + p.radians(p.random(-15, 15));
                p.line(lx, ly, lx - Math.cos(angle) * len, ly - Math.sin(angle) * len);
            }
        }

        // --- GLOW ---
        if (speed > 2) {
            let glowAlpha = p.map(speed, 2, 10, 10, 60);
            p.noStroke();
            let glowGrad = p.drawingContext.createRadialGradient(x, y, 0, x, y, currentSize * 1.5);
            glowGrad.addColorStop(0, `rgba(${ballColor.r}, ${ballColor.g}, ${ballColor.b}, ${glowAlpha/255})`);
            glowGrad.addColorStop(1, `rgba(${ballColor.r}, ${ballColor.g}, ${ballColor.b}, 0)`);
            p.drawingContext.fillStyle = glowGrad;
            p.ellipse(x, y, currentSize * 3, currentSize * 3);
        }

        // --- IMPACT FLASH ---
        if (lastImpactSpeed > 2 && restTimer < 15) {
            let flashAlpha = p.map(lastImpactSpeed, 2, 15, 50, 200) * (1 - restTimer / 15);
            p.fill(255, 255, 255, flashAlpha);
            p.noStroke();
            p.ellipse(x, y, currentSize * 1.8, currentSize * 1.8);
        }

        // --- MAIN BALL ---
        p.push();
        p.translate(x, y);
        let angle = Math.atan2(vy, vx);
        p.rotate(angle);
        p.scale(squish, stretch);

        let gradient = p.drawingContext.createRadialGradient(
            -currentSize / 4, -currentSize / 4, 0,
            0, 0, currentSize / 1.5
        );
        let c = ballColor;
        gradient.addColorStop(0, `rgb(${c.r + 60}, ${c.g + 60}, ${c.b + 60})`);
        gradient.addColorStop(0.5, `rgb(${c.r}, ${c.g}, ${c.b})`);
        gradient.addColorStop(1, `rgb(${c.r - 50}, ${c.g - 50}, ${c.b - 50})`);
        p.drawingContext.fillStyle = gradient;
        p.ellipse(0, 0, currentSize, currentSize);

        let highlightAlpha = 100 + speedFactor * 60;
        p.fill(255, 255, 255, highlightAlpha);
        p.noStroke();
        p.ellipse(-currentSize / 4, -currentSize / 4, currentSize / 3, currentSize / 4);
        p.fill(255, 255, 255, 30);
        p.ellipse(currentSize / 6, currentSize / 6, currentSize / 5, currentSize / 6);
        p.pop();

        // --- SHADOW ---
        if (y < groundY) {
            let distToGround = groundY - y;
            let shadowSize = currentSize * (0.5 + 0.5 * (1 - distToGround / 400));
            let shadowAlpha = p.map(distToGround, 0, 400, 80, 10);
            let shadowBlur = p.map(distToGround, 0, 400, 15, 5);
            p.fill(0, 0, 0, shadowAlpha);
            p.noStroke();
            p.ellipse(x, groundY + 5, shadowSize + shadowBlur, shadowSize * 0.2 + shadowBlur * 0.3);
        }

        // --- GROUND ---
        p.stroke(80, 100, 120, 120);
        p.strokeWeight(1);
        for (let i = 0; i < p.width; i += 2) {
            let gh = groundY + p.noise(i * 0.02 + windTime * 0.3) * 2;
            p.point(i, gh);
        }

        // --- GROUND REFLECTION ---
        if (y < groundY && currentSize > 10) {
            let reflectAlpha = p.map(y, 50, groundY, 0, 25);
            p.fill(ballColor.r, ballColor.g, ballColor.b, reflectAlpha);
            p.noStroke();
            let reflectY = groundY + (groundY - y) * 0.3;
            p.ellipse(x, reflectY, currentSize * 0.8, currentSize * 0.1);
        }

        // --- ENERGY BAR ---
        let kineticEnergy = 0.5 * mass * speed * speed;
        let maxKE = 1000;
        let keRatio = Math.min(kineticEnergy / maxKE, 1);

        p.noStroke();
        p.fill(20, 24, 34);
        p.rect(p.width - 170, 20, 150, 100);

        p.fill(140, 160, 190);
        p.textSize(10);
        p.textFont('JetBrains Mono');
        p.textStyle(p.BOLD);
        p.text("ENERGY", p.width - 158, 36);
        p.textStyle(p.NORMAL);

        p.textSize(9);
        p.fill(100, 120, 150);
        p.text("KINETIC", p.width - 158, 54);
        p.fill(140, 200, 255);
        p.text(`${kineticEnergy.toFixed(1)} J`, p.width - 70, 54);

        p.textSize(9);
        p.fill(100, 120, 150);
        p.text("GRAVITY", p.width - 158, 70);
        p.fill(255, 200, 100);
        let potentialEnergy = mass * gravity * (groundY - y) / 100;
        p.text(`${potentialEnergy.toFixed(1)} J`, p.width - 70, 70);

        p.textSize(9);
        p.fill(100, 120, 150);
        p.text("SPEED", p.width - 158, 86);
        p.fill(255, 255, 255);
        p.text(`${speed.toFixed(1)} m/s`, p.width - 70, 86);

        // KE bar
        p.fill(40, 48, 64);
        p.rect(p.width - 158, 94, 130, 8);
        p.fill(80, 200, 255, 200);
        p.rect(p.width - 158, 94, 130 * keRatio, 8);

        // --- HUD ---
        p.fill(20, 24, 34);
        p.rect(10, 10, 155, 120);

        p.fill(140, 160, 190);
        p.textSize(10);
        p.textFont('JetBrains Mono');
        p.textStyle(p.BOLD);
        p.text("FREE FALL", 20, 26);
        p.textStyle(p.NORMAL);

        let labels = [
            { label: "GRAVITY", val: `${gravity.toFixed(2)} m/s²`, col: [255, 200, 100] },
            { label: "MASS", val: `${mass.toFixed(1)} kg`, col: [180, 220, 255] },
            { label: "WIND", val: `${(windForce * 100).toFixed(1)}%`, col: [150, 220, 180] },
            { label: "BOUNCES", val: `${bounceCount}`, col: [255, 160, 160] },
            { label: "STATUS", val: y >= groundY ? (isResting && restTimer > 30 ? "RESTING" : "BOUNCING") : "FALLING", col: isResting ? [150, 200, 150] : [255, 200, 100] },
        ];
        labels.forEach((item, i) => {
            p.fill(100, 120, 150);
            p.textSize(9);
            p.text(item.label, 20, 44 + i * 16);
            p.fill(item.col[0], item.col[1], item.col[2]);
            p.text(item.val, 85, 44 + i * 16);
        });

        // impact text
        if (lastImpactSpeed > 3 && restTimer < 8) {
            let flashText = `${lastImpactSpeed.toFixed(1)} m/s`;
            p.fill(255, 200, 100, 200 * (1 - restTimer / 8));
            p.textSize(14);
            p.textFont('JetBrains Mono');
            p.textStyle(p.BOLD);
            p.text(flashText, x - 30, y - currentSize - 20);
            p.textStyle(p.NORMAL);
        }

        if (restTimer > 15) {
            lastImpactSpeed = 0;
        }
    };

    p.mousePressed = () => {
        x = p.mouseX;
        y = Math.max(50, p.mouseY - 20);
        vy = p.random(-2, 0);
        vx = p.random(-3, 3);
        bounceCount = 0;
        trail = [];
        particles = [];
        ripples = [];
        isResting = false;
        restTimer = 0;
        lastImpactSpeed = 0;
        windTime = p.random(1000);
    };
}
