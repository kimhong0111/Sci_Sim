// sketches/freeFallSketch.js
export function freeFallSketch(p, configRef) {
    // Physics state
    let x = 300;
    let y = 50;
    let vx = 0;
    let vy = 0;
    
    // Natural variation parameters
    let windTime = 0;
    let bounceCount = 0;
    let trail = [];
    const MAX_TRAIL = 30;
    
    // Physics properties
    let gravity = 9.8;
    let mass = 1;
    let damping = 0.85;
    let airResistance = 0.02;
    let windStrength = 0.3;
    let springStiffness = 0.3;
    let groundY = 570;
    
    // Resting state
    let isResting = false;
    let restTimer = 0;
    let lastImpactSpeed = 0;
    
    // Visual state
    let ballColor = { r: 100, g: 180, b: 255 };
    let trailColor = { r: 100, g: 180, b: 255 };

    p.setup = () => {
        p.createCanvas(600, 600);
        p.frameRate(60);
        vx = p.random(-2, 2);
    };

    p.draw = () => {
        // Update config values
        const config = configRef.current;
        if (config) {
            gravity = config.gravity ?? 9.8;
            mass = config.mass ?? 1;
            damping = config.damping ?? 0.85;
            airResistance = config.airResistance ?? 0.02;
            windStrength = config.windStrength ?? 0.3;
            springStiffness = config.springStiffness ?? 0.3;
            
            // Update color if provided
            if (config.color) {
                const colorParts = config.color.split(',').map(Number);
                if (colorParts.length === 3) {
                    ballColor = { r: colorParts[0], g: colorParts[1], b: colorParts[2] };
                    trailColor = { ...ballColor };
                }
            }
        }
        
        // Semi-transparent background for motion trail
        p.background(30, 30, 40, p.map(trail.length, 0, MAX_TRAIL, 255, 40));
        
        // 1. NATURAL WIND FORCE (Perlin Noise)
        windTime += 0.01;
        let windForce = p.noise(windTime) * windStrength * 2 - windStrength;
        let gust = p.noise(windTime * 0.5) > 0.7 ? 2 : 1;
        windForce *= gust;
        
        // 2. AIR RESISTANCE (Drag proportional to velocity²)
        let speed = p.sqrt(vx*vx + vy*vy);
        let dragX = -vx * airResistance * speed;
        let dragY = -vy * airResistance * speed;
        
        // 3. APPLY FORCES
        let gravityVariation = 1 + p.noise(windTime + 100) * 0.02;
        let effectiveGravity = gravity * gravityVariation;
        vy += effectiveGravity * 0.05;
        
        vx += windForce * 0.05;
        vx += dragX * 0.1;
        vy += dragY * 0.1;
        
        // 4. DAMPING
        vx *= 0.999;
        vy *= 0.999;
        
        // 5. UPDATE POSITION
        x += vx;
        y += vy;
        
        // 6. SOFT GROUND INTERACTION
        if (y >= groundY) {
            let penetration = y - groundY;
            let springForce = -springStiffness * penetration;
            vy += springForce * 0.1;
            vy *= damping;
            vx *= 0.98;
            y = groundY + penetration * 0.1;
            
            if (Math.abs(vy) > 1) {
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
        }
        
        // 7. SOFT WALLS
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
        
        // 8. SIZE AND SHAPE VARIATION
        let sizeVariation = 1 + p.noise(windTime + 200) * 0.05;
        let baseSize = p.map(mass, 0.5, 5, 15, 50);
        let currentSize = baseSize * sizeVariation;
        
        // Squish and stretch
        let squish = 1;
        let stretch = 1;
        let speedFactor = Math.min(speed / 5, 1);
        
        if (Math.abs(vy) > 1 && y >= groundY - 10) {
            let impactForce = Math.min(Math.abs(vy) / 10, 1);
            squish = 1 + impactForce * 0.15;
            stretch = 1 - impactForce * 0.12;
        } else if (speed > 1) {
            squish = 1 + speedFactor * 0.05;
            stretch = 1 - speedFactor * 0.04;
        }
        
        // 9. VISUAL EFFECTS
        
        // Motion trail
        trail.push({x: x, y: y, size: currentSize, speed: speed});
        if (trail.length > MAX_TRAIL) trail.shift();
        
        trail.forEach((pos, i) => {
            let alpha = (i / trail.length) * 60;
            let trailSize = currentSize * (0.2 + 0.8 * (i / trail.length));
            p.fill(trailColor.r, trailColor.g, trailColor.b, alpha);
            p.noStroke();
            p.ellipse(pos.x, pos.y, trailSize, trailSize);
        });
        
        // Impact flash
        if (lastImpactSpeed > 2 && restTimer < 10) {
            let flashAlpha = p.map(lastImpactSpeed, 2, 15, 50, 200) * (1 - restTimer/10);
            p.fill(255, 255, 255, flashAlpha);
            p.noStroke();
            p.ellipse(x, y, currentSize * 1.5, currentSize * 1.5);
        }
        
        // Main ball with squish
        p.push();
        p.translate(x, y);
        let angle = Math.atan2(vy, vx);
        p.rotate(angle);
        p.scale(squish, stretch);
        
        // Gradient fill for 3D effect
        let gradient = p.drawingContext.createRadialGradient(
            -currentSize/4, -currentSize/4, 0,
            0, 0, currentSize/1.5
        );
        let c = ballColor;
        gradient.addColorStop(0, `rgb(${c.r+50}, ${c.g+50}, ${c.b+50})`);
        gradient.addColorStop(0.6, `rgb(${c.r}, ${c.g}, ${c.b})`);
        gradient.addColorStop(1, `rgb(${c.r-40}, ${c.g-40}, ${c.b-40})`);
        p.drawingContext.fillStyle = gradient;
        p.ellipse(0, 0, currentSize, currentSize);
        
        // Specular highlight
        let highlightAlpha = 80 + speedFactor * 40;
        p.fill(255, 255, 255, highlightAlpha);
        p.noStroke();
        p.ellipse(-currentSize/4, -currentSize/4, currentSize/3, currentSize/4);
        p.fill(255, 255, 255, 30);
        p.ellipse(currentSize/6, currentSize/6, currentSize/5, currentSize/6);
        p.pop();
        
        // Shadow
        if (y < groundY) {
            let shadowSize = currentSize * (0.5 + 0.5 * (1 - (groundY - y) / 400));
            let shadowAlpha = p.map(y, 50, groundY, 10, 60);
            let shadowBlur = p.map(y, 50, groundY, 20, 5);
            p.fill(0, 0, 0, shadowAlpha);
            p.noStroke();
            p.ellipse(x, groundY + 5, shadowSize + shadowBlur, shadowSize * 0.2 + shadowBlur * 0.3);
        }
        
        // Ground line
        p.stroke(100, 120, 140, 150);
        p.strokeWeight(1);
        for (let i = 0; i < p.width; i += 3) {
            let groundHeight = groundY + p.noise(i * 0.02 + windTime * 0.5) * 2;
            p.point(i, groundHeight);
        }
        
        // Ground reflection
        if (y < groundY && currentSize > 10) {
            let reflectAlpha = p.map(y, 50, groundY, 0, 20);
            p.fill(ballColor.r, ballColor.g, ballColor.b, reflectAlpha);
            p.noStroke();
            let reflectY = groundY + (groundY - y) * 0.3;
            p.ellipse(x, reflectY, currentSize * 0.8, currentSize * 0.1);
        }
        
        // UI
        p.fill(255, 255, 255, 200);
        p.noStroke();
        p.textSize(12);
        p.textFont('monospace');
        p.text(`⚡ gravity: ${gravity.toFixed(2)}`, 20, 30);
        p.text(`⚖️ mass: ${mass.toFixed(1)}`, 20, 50);
        p.text(`🌬️ wind: ${(windForce * 100).toFixed(1)}%`, 20, 70);
        p.text(`🎯 speed: ${speed.toFixed(1)}`, 20, 90);
        p.text(`🔄 bounces: ${bounceCount}`, 20, 110);
        
        if (isResting && restTimer > 30) {
            p.text(`💤 resting`, 20, 130);
        }
        
        // Impact flash text
        if (lastImpactSpeed > 3 && restTimer < 5) {
            let flashText = `💥 ${lastImpactSpeed.toFixed(1)} m/s`;
            p.fill(255, 200, 100, 200 * (1 - restTimer/5));
            p.textSize(16);
            p.text(flashText, x - 40, y - currentSize - 30);
        }
        
        // Click hint
        let pulse = Math.sin(p.frameCount * 0.05) * 0.5 + 0.5;
        p.fill(255, 255, 255, 80 + pulse * 40);
        p.textSize(12);
        p.text(`👆 click to reset ball`, 20, 570);
        
        if (restTimer > 10) {
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
        isResting = false;
        restTimer = 0;
        lastImpactSpeed = 0;
        windTime = p.random(1000);
    };
}