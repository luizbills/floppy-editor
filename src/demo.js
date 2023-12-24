export default `
floppy({
  fullscreen: true,
  antialias: false
});

color = 0

function update (dt) {
  CENTERX = WIDTH / 2
  CENTERY = HEIGHT / 2
  radius = math.rand() * CENTERY
  color = TICKS
}

function draw () {
  clear(0)
  circle(CENTERX, CENTERY, radius, color)
}
`.trim() + "\n";
