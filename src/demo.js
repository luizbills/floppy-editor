export default () =>
  `
floppy({
  fullscreen: true,
  antialias: false
});

function init () {
  color = 0
  centerx = WIDTH / 2
  centery = HEIGHT / 2
}

function update (dt) {
  color = ELAPSED * 32 % 16

  if (TAPPED) {
    centerx = TAPX
    centery = TAPY
    sfx(7)
  }

  radius = math.rand() * centery
}

function draw () {
  clear(0)
  circle(centerx, centery, radius, color)
}
`.trim() + "\n";
