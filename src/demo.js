export default () =>
  `
floppy({
  fullscreen: true,
  antialias: false
});

function init () {
  color = 0
  x = CENTERX
  y = CENTERY
}

function update (dt) {
  color = ELAPSED * 32 % 16

  if (TAPPED) {
    x = TAPX
    y = TAPY
    sfx(7)
  }

  radius = math.rand() * y
}

function draw () {
  clear(0)
  circle(x, y, radius, color)
}
`.trim() + "\n";
