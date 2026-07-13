export const sketchKey = "waveInterference";
export const sketchLabel = "Wave Interference";
export const sketch = waveInterferenceSketch;

function waveInterferenceSketch(p, configRef) {
  p.setup = () => {
    p.createCanvas(1200, 600);
  };
  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Wave Interference — coming soon", p.width / 2, p.height / 2);
  };
}
