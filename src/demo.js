export default `
floppy({
  fullscreen: true,
  antialias: false
});

CENTERX = WIDTH / 2
CENTERY = HEIGHT / 2
color = 6

function update () {
  radius = math.rand() * CENTERX
  color = TICKS
}

function draw () {
  clear(0)
  circle(CENTERX, CENTERY, radius, color)
}
`.trim() + "\n";
