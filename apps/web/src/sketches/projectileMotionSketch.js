export const sketchKey = "projectileMotion";
export const sketchLabel = "Projectile Motion";
export const sketch = projectileMotionSketch;

function projectileMotionSketch(p, configRef) {
    let launched = false;
    let finished = false;
    let paused = false;
    let px, py, vx, vy;
    let trail = [];
    let timeOfFlight = 0;
    let maxHeight = 0;
    let range = 0;
    let camX = 0;
    let camY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const W = 800;
    const H = 500;
    const GROUND_Y = H - 60;
    const ORIGIN_X = 80;
    const SCALE = 18;
    const WORLD_WIDTH = W * 15;

    const BG = [15, 20, 30];
    const GROUND_COLOR = [30, 80, 50];
    const BALL_COLOR = [255, 120, 50];
    const TRAIL_COLOR = [255, 180, 50];
    const GRID_COLOR = [40, 50, 65];
    const TEXT_COLOR = [180, 200, 220];
    const ACCENT = [80, 220, 200];

     p.setup = () => {
        p.createCanvas(W, H);
        p.frameRate(60);
    };

    function resetSim() {
        const { angle, initialVelocity } = configRef.current;
        const rad = (angle * Math.PI) / 180;
        px = ORIGIN_X;
        py = GROUND_Y;
        vx = initialVelocity * Math.cos(rad);
        vy = -initialVelocity * Math.sin(rad);
        trail = [];
        launched = false;
        finished = false;
        paused = false;
        timeOfFlight = 0;
        maxHeight = 0;
        range = 0;
        camX = 0;
        camY = 0;
        targetCamX = 0;
        targetCamY = 0;
    }

    function launch() {
        resetSim();
        launched = true;
        finished = false;
        paused = false;
    }

    p.draw = () => {
        const { angle, initialVelocity, gravity, showVectors } = configRef.current;

        p.background(...BG);

        // camera follow
        if (launched && !finished && !paused) {
            targetCamX = -(px - W * 0.3);
            targetCamY = -(py - H * 0.5);
            camX += (targetCamX - camX) * 0.08;
            camY += (targetCamY - camY) * 0.08;
        } else if (finished && !paused) {
            targetCamX = 0;
            targetCamY = 0;
            camX += (targetCamX - camX) * 0.03;
            camY += (targetCamY - camY) * 0.03;
            if (Math.abs(camX) < 0.5) camX = 0;
            if (Math.abs(camY) < 0.5) camY = 0;
        }

        p.push();
        p.translate(camX, camY);

        // grid - extended in all directions
        p.stroke(...GRID_COLOR);
        p.strokeWeight(1);
        for (let x = ORIGIN_X; x < WORLD_WIDTH; x += SCALE * 2) {
            p.line(x, -H * 10, x, GROUND_Y);
        }
        for (let y = GROUND_Y; y > -H * 10; y -= SCALE * 2) {
            p.line(ORIGIN_X, y, WORLD_WIDTH, y);
        }

        // axis labels - only draw visible ones
        p.fill(...TEXT_COLOR);
        p.noStroke();
        p.textSize(10);
        for (let i = 0; i * SCALE * 2 < WORLD_WIDTH - ORIGIN_X; i += 2) {
            const lx = ORIGIN_X + i * SCALE * 2;
            if (lx + camX > 0 && lx + camX < W) {
                p.text(i * 2, lx - 4, GROUND_Y + 18);
            }
        }
        for (let i = 0; i * SCALE * 2 < H * 10; i += 2) {
            const ly = GROUND_Y - i * SCALE * 2;
            if (ly + camY > 0 && ly + camY < H) {
                p.text(i * 2, ORIGIN_X - 22, ly + 4);
            }
        }

        // axes
        p.stroke(...ACCENT);
        p.strokeWeight(1.5);
        p.line(ORIGIN_X, GROUND_Y, WORLD_WIDTH, GROUND_Y);
        p.line(ORIGIN_X, GROUND_Y, ORIGIN_X, -H * 10);

        // ground
        p.fill(...GROUND_COLOR);
        p.noStroke();
        p.rect(ORIGIN_X, GROUND_Y, WORLD_WIDTH, H * 2);

        // launcher arm
        const launchRad = (angle * Math.PI) / 180;
        const launcherLen = 30;
        p.stroke(...ACCENT);
        p.strokeWeight(4);
        p.line(
            ORIGIN_X, GROUND_Y,
            ORIGIN_X + launcherLen * Math.cos(launchRad),
            GROUND_Y - launcherLen * Math.sin(launchRad)
        );
        p.fill(...ACCENT);
        p.noStroke();
        p.ellipse(ORIGIN_X, GROUND_Y, 12, 12);

        // predicted trajectory
        if (!launched) {
            p.stroke(255, 255, 255, 40);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([4, 6]);
            let tx = ORIGIN_X;
            let ty = GROUND_Y;
            let tvx = initialVelocity * Math.cos(launchRad);
            let tvy = -initialVelocity * Math.sin(launchRad);
            p.beginShape();
            p.vertex(tx, ty);
            for (let t = 0; t < 600; t++) {
                tvy += gravity * 0.016;
                tx += tvx * 0.016 * SCALE;
                ty += tvy * 0.016 * SCALE;
                if (ty >= GROUND_Y) break;
                p.vertex(tx, ty);
            }
            p.endShape();
            p.drawingContext.setLineDash([]);
            p.stroke(255, 255, 100, 80);
            p.strokeWeight(1);
            p.line(tx, GROUND_Y - 10, tx, GROUND_Y + 10);
            p.fill(255, 255, 100, 150);
            p.noStroke();
            p.textSize(10);
            p.text(`${((tx - ORIGIN_X) / SCALE).toFixed(1)} m`, tx + 4, GROUND_Y - 4);
        }

        // trail
        if (trail.length > 1) {
            for (let i = 1; i < trail.length; i++) {
                const alpha = p.map(i, 0, trail.length, 0, 255);
                p.stroke(TRAIL_COLOR[0], TRAIL_COLOR[1], TRAIL_COLOR[2], alpha);
                p.strokeWeight(2);
                p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
            }
        }

        // physics update
        if (launched && !finished && !paused) {
            const dt = 0.016;
            vy += gravity * dt;
            px += vx * dt * SCALE;
            py += vy * dt * SCALE;
            timeOfFlight += dt;
            trail.push({ x: px, y: py });

            const currentHeight = (GROUND_Y - py) / SCALE;
            if (currentHeight > maxHeight) maxHeight = currentHeight;

            if (py >= GROUND_Y) {
                py = GROUND_Y;
                finished = true;
                range = (px - ORIGIN_X) / SCALE;
            }
        }

        // ball
        if (launched) {
            p.noStroke();
            for (let r = 20; r > 0; r -= 4) {
                p.fill(BALL_COLOR[0], BALL_COLOR[1], BALL_COLOR[2], 15);
                p.ellipse(px, py, r * 2, r * 2);
            }
            p.fill(...BALL_COLOR);
            p.ellipse(px, py, 16, 16);

            if (showVectors && !finished && !paused) {
                drawArrow(px, py, vx * 0.5, 0, [80, 180, 255]);
                drawArrow(px, py, 0, vy * 0.5, [255, 100, 150]);
                drawArrow(px, py, vx * 0.5, vy * 0.5, [80, 220, 200]);
            }

            // landing marker
            if (finished) {
                p.stroke(255, 255, 100);
                p.strokeWeight(2);
                p.line(px, GROUND_Y - 15, px, GROUND_Y + 5);
                p.fill(255, 255, 100);
                p.noStroke();
                p.textSize(11);
                p.text(`${range.toFixed(1)} m`, px + 6, GROUND_Y - 4);
            }
        } else {
            p.noStroke();
            p.fill(...BALL_COLOR);
            p.ellipse(ORIGIN_X, GROUND_Y, 16, 16);
        }

        // max height indicator
        if (launched && maxHeight > 0) {
            const peakY = GROUND_Y - maxHeight * SCALE;
            const peakX = trail.length > 0
                ? trail.reduce((a, b) => a.y < b.y ? a : b).x
                : px;
            p.stroke(255, 255, 100, 80);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([4, 4]);
            p.line(ORIGIN_X, peakY, peakX + 60, peakY);
            p.drawingContext.setLineDash([]);
            p.fill(255, 255, 100);
            p.noStroke();
            p.textSize(11);
            p.text(`↑ ${maxHeight.toFixed(1)} m`, ORIGIN_X + 4, peakY - 4);
        }

        // paused dim overlay
        if (paused) {
            p.fill(0, 0, 0, 100);
            p.noStroke();
            p.rect(-camX, -camY, W, H); // fixed to screen coords
        }

        p.pop(); // end camera

        // screen-space UI
        if (paused) {
            p.fill(255, 255, 255, 180);
            p.textSize(14);
            p.textStyle(p.BOLD);
            p.textAlign(p.LEFT, p.BASELINE);
            p.text("PAUSED", 12, H - 10);
            p.textStyle(p.NORMAL);
        }

        // camera offset indicator
        if (Math.abs(camX) > 10 || Math.abs(camY) > 10) {
            p.fill(255, 255, 255, 80);
            p.textSize(10);
            p.textAlign(p.LEFT, p.BASELINE);
            const offsetX = (-camX / SCALE).toFixed(0);
            const offsetY = (-camY / SCALE).toFixed(0);
            p.text(`cam: ${offsetX}m x, ${offsetY}m y`, paused ? 90 : 10, H - 10);
        }

        drawHUD(angle, initialVelocity, gravity);
    };

    function drawArrow(x, y, dx, dy, col) {
        p.stroke(...col);
        p.strokeWeight(2);
        p.fill(...col);
        p.line(x, y, x + dx * SCALE * 0.3, y + dy * SCALE * 0.3);
        const ang = Math.atan2(dy, dx);
        const len = 8;
        p.push();
        p.translate(x + dx * SCALE * 0.3, y + dy * SCALE * 0.3);
        p.rotate(ang);
        p.triangle(0, 0, -len, -len / 2, -len, len / 2);
        p.pop();
    }

    function drawHUD(angle, velocity, gravity) {
        p.fill(20, 28, 42, 220);
        p.noStroke();
        p.rect(W - 170, 10, 158, 148, 8);

        p.fill(...ACCENT);
        p.textSize(10);
        p.textStyle(p.BOLD);
        p.text("MEASUREMENTS", W - 158, 28);
        p.textStyle(p.NORMAL);

        const metrics = [
            ["Angle",       `${angle}`],
            ["Init. Speed", `${velocity} m/s`],
            ["Gravity",     `${gravity} m/s`],
            ["Max Height",  `${maxHeight.toFixed(1)} m`],
            ["Range",       `${finished ? range.toFixed(1) : "-"} m`],
            ["Time",        `${timeOfFlight.toFixed(2)} s`],
        ];
        metrics.forEach(([label, val], i) => {
            p.fill(...TEXT_COLOR);
            p.textSize(11);
            p.text(label, W - 158, 46 + i * 18);
            p.fill(...ACCENT);
            p.text(val, W - 65, 46 + i * 18);
        });

        // pause button - only when in flight
        if (launched && !finished) {
            const pbx = W - 158, pby = H - 84, pbw = 130, pbh = 28;
            const hoverPause = p.mouseX > pbx && p.mouseX < pbx + pbw &&
                               p.mouseY > pby && p.mouseY < pby + pbh;
            p.fill(hoverPause ? 100 : 70, hoverPause ? 130 : 100, hoverPause ? 180 : 150);
            p.noStroke();
            p.rect(pbx, pby, pbw, pbh, 5);
            p.fill(255);
            p.textSize(11);
            p.textStyle(p.BOLD);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(paused ? "RESUME" : "PAUSE", pbx + pbw / 2, pby + pbh / 2);
            p.textAlign(p.LEFT, p.BASELINE);
            p.textStyle(p.NORMAL);
        }

        // launch button
        const lbx = W - 158, lby = H - 48, lbw = 70, lbh = 28;
        const hoverLaunch = p.mouseX > lbx && p.mouseX < lbx + lbw &&
                            p.mouseY > lby && p.mouseY < lby + lbh;
        p.fill(hoverLaunch ? 255 : 220, hoverLaunch ? 140 : 100, hoverLaunch ? 70 : 40);
        p.noStroke();
        p.rect(lbx, lby, lbw, lbh, 5);
        p.fill(255);
        p.textSize(11);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("LAUNCH", lbx + lbw / 2, lby + lbh / 2);

        // reset button
        const rbx = W - 80, rby = H - 48, rbw = 60, rbh = 28;
        const hoverReset = p.mouseX > rbx && p.mouseX < rbx + rbw &&
                           p.mouseY > rby && p.mouseY < rby + rbh;
        p.fill(hoverReset ? 80 : 50, hoverReset ? 90 : 60, hoverReset ? 110 : 90);
        p.rect(rbx, rby, rbw, rbh, 5);
        p.fill(255);
        p.text("RESET", rbx + rbw / 2, rby + rbh / 2);
        p.textAlign(p.LEFT, p.BASELINE);
        p.textStyle(p.NORMAL);
    }

    p.mousePressed = () => {
        if (launched && !finished) {
            const pbx = W - 158, pby = H - 84, pbw = 130, pbh = 28;
            if (p.mouseX > pbx && p.mouseX < pbx + pbw &&
                p.mouseY > pby && p.mouseY < pby + pbh) {
                paused = !paused;
                return;
            }
        }

        const lbx = W - 158, lby = H - 48, lbw = 70, lbh = 28;
        if (p.mouseX > lbx && p.mouseX < lbx + lbw &&
            p.mouseY > lby && p.mouseY < lby + lbh) {
            launch();
            return;
        }

        const rbx = W - 80, rby = H - 48, rbw = 60, rbh = 28;
        if (p.mouseX > rbx && p.mouseX < rbx + rbw &&
            p.mouseY > rby && p.mouseY < rby + rbh) {
            resetSim();
            return;
        }
    };

    resetSim();
}