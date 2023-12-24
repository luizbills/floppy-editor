export default `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Floppy Editor</title>
    <style>
      html, body {height: 100%}
      body {margin: 0}
      #err {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: blue;
        color: white;
        font-weight: bold;
        font-family: monospace;
        padding: 1em;
        font-size: 2em;
      }
    </style>
  </head>
  <body>
    <div id="err" style="display:none"></div>
    <script>
      // catch errors
      const err = document.getElementById('err')
      window.addEventListener('error', (ev) => {
        err.textContent = ev.message + ' in line ' + (ev.lineno - 36)
        err.style.display = 'block'
      })
    </script>
    <script src="floppy.js"></script>
    <script>
      {code}
    </script>
  </body>
</html>`.trim();
