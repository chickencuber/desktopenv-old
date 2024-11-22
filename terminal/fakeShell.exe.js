Array.prototype.chunk = function (arr) {
  const temp = [];
  let i = 0;
  for (const v of arr) {
    const aa = [];
    for (const _ of v) {
      aa.push(this[i]);
      i++;
    }
    temp.push(aa);
  }
  return temp;
};

function fakeShell() {
  const term = {
    _text: "",
    text(v) {
      if (v === undefined) {
        return this._text;
      }
      this._text = v;
    },
    scroll: {
      get height() {
        const temp = term._text.split("\n").length * 27.5 - Shell.size.height;
        return temp < 0 ? 0 : temp;
      },
    },
  };
  const shell = {
    in_emulator: true,
    localVars: {
      workingDir: "/",
    },
    reboot() {
      Shell.reboot();
    },
    onExit: () => {},
    exit: false,
    keyPressed: () => {},
    keyReleased: () => {},
    mouseClicked: () => {},
    mouseDragged: () => {},
    mousePressed: () => {},
    mouseReleased: () => {},
    mouseMoved: () => {},
    windowResized: () => {},
    keyIsDown(...args) {
      return Shell.keyIsDown(...args);
    },
    get keyIsPressed() {
      return Shell.keyIsPressed;
    },
    get deltaTime() {
      return Shell.deltaTime;
    },
    gl: {
      canvas: false,
      ready: false,
      createGraphics: (...args) => {
        return Shell.gl.createGraphics(...args);
      },
      mouse: {
        get x() {
          return Shell.gl.mouse.x;
        },
        get y() {
          return Shell.gl.mouse.y;
        },
        get isDown() {
          return Shell.gl.mouse.isDown;
        },
      },
      resize() {
        this.canvas.resizeCanvas(Shell.size.width, Shell.size.height);
      },
      draw: () => {},
      setup: () => {},
      get fonts() {
        return Shell.gl.fonts;
      },
      new(renderer = P2D) {
        this.canvas = Shell.gl.createGraphics(
          Shell.size.width,
          Shell.size.height,
          renderer
        );
        shell.gl.setup();
        shell.gl.ready = true;
      },
    },
    size: {
      get width() {
        return Shell.size.width;
      },
      get height() {
        return Shell.size.height;
      },
    },
    terminal: {
      text(v) {
        if (v !== undefined) {
          term.text(v);
        }
        return term.text();
      },
      color: "#ffffff", 
      scroll: {
        allow: false,
        x: 0,
        y: 0,
      },
      cursor: { x: 0, y: 0, style: "block" },

      getLine() {
        return this.text().split("\n")[shell.terminal.cursor.y] || "";
      },

      clear() {
        shell.terminal.cursor.x = 0;
        shell.terminal.cursor.y = 0;
        term.text("");
      },

      delete() {
        const cursor = shell.terminal.cursor;
        const textArray = term
          .text()
          .split("\n")
          .map((v) => v.split(""));

        while (textArray.length <= cursor.y) {
          textArray.push([]);
        }

        if (cursor.x === 0) {
          if (cursor.y > 0) {
            const deletedText = textArray.splice(cursor.y, 1)[0];
            shell.terminal.cursor.y--;
            shell.terminal.cursor.x = textArray[cursor.y].join("").length;

            textArray[cursor.y].push(...deletedText);

            term.text(textArray.map((v) => v.join("")).join("\n"));
          }
          return;
        }

        textArray[cursor.y].splice(cursor.x - 1, 1);

        term.text(textArray.map((v) => v.join("")).join("\n"));

        cursor.x--;
      },

      add(str) {
        const cursor = shell.terminal.cursor;
        const textArray = term
          .text()
          .split("\n")
          .map((v) => v.split(""));

        while (textArray.length <= cursor.y) {
          textArray.push([]);
        } 

        textArray[cursor.y].splice(cursor.x, 0, ...str.split(""));

        term.text(textArray.map((v) => v.join("")).join("\n"));
        cursor.x += str.length;
        cursor.y += (str.match(/\n/g) || []).length;

        if (str.endsWith("\n")) {
          cursor.x = 0;
        }

        shell.terminal.scroll.y = term.scroll.height;
      },
    },
    update() {
      Shell.update();
    },
    async run(command, _shell = shell) {
      shell.name = command.split(" ")[0];
      return await Shell.run(command, _shell);
    },
  };

  return shell;
}

return { fakeShell };
