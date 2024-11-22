const g = Shell.gl.createGraphics(400, 400);
const d = 1000;
const c1 = g.color(0, 0, 255);
const c2 = g.color(0, 255, 255);
g.noStroke();
g.background(c1);
for (let i = 0; i < d; i += 5) {
  g.fill(g.lerpColor(c1, c2, i / d));
  g.ellipse(0, 0, d - i);
}
return g;
