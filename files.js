const { Event, Button, Div, Element, root, vw, vh } = await use("~/ui.exe");

Shell.name = "files";

if (!Shell.in_desktop) {
  return "please use desktop";
}

let scroll = 0;

let height = 0;

root.on(Event.keyPressed, (key) => {
  if (key === UP_ARROW && scroll > 0) {
    scroll -= 10;
  } else if (key === DOWN_ARROW && height > Shell.size.height) {
    scroll += 10;
  }
});

function options(...args) {
  freeze = true;
  const temp = root.children;
  root.children = [];
  function finish() {
    root.children = temp;
    freeze = false;
  }
  let y = 0;
  const h = (args.length * 23) / 2;
  for (const [name, func = () => {}] of args) {
    const button = new Button({ text: name });
    button.rect.width = vw(100);
    button.rect.y = y;
    y += 23;
    button.on(Event.mousePressed, () => {
      func();
      finish();
    });
    root.child(button);
  }
}

function Files(dy = 0) {
  const files = FS.getFromPath(Shell.localVars.workingDir);
  let y = -scroll + dy;
  const temp = Object.keys(files);
  if (Shell.localVars.workingDir !== "/") {
    temp.unshift("..");
  }

  return temp.map((v) => {
    const temp = new Button({ text: v });
    temp.rect.width = vw(100) - 23;
    temp.rect.y = y;
    temp.on(Event.mousePressed, () => {
      const path = getPath("/" + Shell.localVars.workingDir + "/" + v);
      if (typeof FS.getFromPath(path) !== "object") {
        if (path.endsWith(".sh") || path.endsWith(".exe")) {
          Shell.createWindow(
            getPath("~/terminal/main.exe") +
              " " +
              path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
          );
          return;
        } else if (
          ["jpg", "jpeg", "png", "gif", "webp", "bmp"].some((v) =>
            path.endsWith(v.toLowerCase())
          )
        ) {
          Shell.createWindow(
            getPath("~/image.exe") +
              " " +
              path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
          );
          return;
        }
        Shell.createWindow(
          getPath("~/terminal/main.exe") +
            " nano " +
            path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
        );
        return;
      }
      Shell.localVars.workingDir = path
        .replaceAll("\\", "\\\\")
        .replaceAll(" ", "\\ ");
    });

    const button = new Button({ text: "…" });
    button.rect.width = 23;
    button.rect.x = vw(100) - button.rect.width;
    button.rect.y = y;

    if (v !== "..") {
      temp.child(button);
    } else {
      temp.rect.width = vw(100);
    }

    const o = [
      [
        "Delete",
        () => {
          FS.delete(getPath("/" + Shell.localVars.workingDir + "/" + v));
        },
      ],
      [
        "Rename",
        () => {
          const name = prompt("name") || "";
          if (name === "") return;
          if (name.includes("/")) {
            alert("name can't include '/'");
            return;
          }
          if (name === "..") {
            alert("name can't be '..'");
            return;
          }
          if (
            FS.exists(getPath("/" + Shell.localVars.workingDir + "/" + name))
          ) {
            alert("name already exists");
            return;
          }
          const path = getPath("/" + Shell.localVars.workingDir + "/" + v);
          const c = FS.getFromPath(path);
          FS.delete(path);
          FS.addFile(getPath("/" + Shell.localVars.workingDir + "/" + name), c);
        },
      ],
      ["Cancel"],
    ];

    if (
      typeof FS.getFromPath(
        getPath("/" + Shell.localVars.workingDir + "/" + v)
      ) !== "object"
    ) {
      o.unshift(
        [
          "Run",
          () => {
            const path = getPath("/" + Shell.localVars.workingDir + "/" + v);
            if (path.endsWith(".sh") || path.endsWith(".exe")) {
              Shell.createWindow(
                getPath("~/terminal/main.exe") +
                  " " +
                  path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
              );
              return;
            } else if (
              ["jpg", "jpeg", "png", "gif", "webp", "bmp"].some((v) =>
                path.endsWith(v.toLowerCase())
              )
            ) {
              Shell.createWindow(
                getPath("~/image.exe") +
                  " " +
                  path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
              );
              return;
            }
            Shell.createWindow(
              getPath("~/terminal/main.exe") + " nano " +
                path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
            );
            return;
          },
        ],
        [
          "Run Without Terminal",
          () => {
            const path = getPath("/" + Shell.localVars.workingDir + "/" + v);
            if (path.endsWith(".sh") || path.endsWith(".exe")) {
              Shell.createWindow(
                path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
              );
              return;
            } else if (
              ["jpg", "jpeg", "png", "gif", "webp", "bmp"].some((v) =>
                path.endsWith(v.toLowerCase())
              )
            ) {
              Shell.createWindow(
                getPath("~/image.exe") +
                  " " +
                  path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
              );
              return;
            }
            Shell.createWindow(
              getPath("~/terminal/main.exe") + " nano " +
                path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
            );
            return;
          },
        ],
        [
          "Open With nano",
          () => {
            const path = getPath("/" + Shell.localVars.workingDir + "/" + v);
            Shell.createWindow(
              getPath("~/terminal/main.exe") + " nano " +
                path.replaceAll("\\", "\\\\").replaceAll(" ", "\\ ")
            );
          },
        ]
      );
    }

    button.on(Event.mousePressed, () => {
      options(...o);
    });

    y += temp.getRect().height;
    height = y;
    return temp;
  });
}

root.style.background = "#fff";

const container = new Div();
container.style.border_width = 0;

const div = new Div({ text: Shell.localVars.workingDir });
div.rect.width = vw(100);
div.style.border_width = 1;
div.rect.autosize = false;
div.style.background = "#ffffff";

let freeze = false;

const button = new Button({ text: "…" });
button.rect.width = 23;
button.rect.x = vw(100) - button.rect.width;

button.on(Event.mousePressed, () => {
  options(
    [
      "Create File",
      () => {
        const name = prompt("name") || "";
        if (name === "") return;
        if (name.includes("/")) {
          alert("name can't include '/'");
          return;
        }
        if (name === "..") {
          alert("name can't be '..'");
          return;
        }
        if (FS.exists(getPath("/" + Shell.localVars.workingDir + "/" + name))) {
          alert("name already exists");
          return;
        }
        FS.addFile(getPath("/" + Shell.localVars.workingDir + "/" + name));
      },
    ],
    [
      "Create Folder",
      () => {
        const name = prompt("name") || "";
        if (name === "") return;
        if (name.includes("/")) {
          alert("name can't include '/'");
          return;
        }
        if (name === "..") {
          alert("name can't be '..'");
          return;
        }
        if (FS.exists(getPath("/" + Shell.localVars.workingDir + "/" + name))) {
          alert("name already exists");
          return;
        }
        FS.addDir(getPath("/" + Shell.localVars.workingDir + "/" + name));
      },
    ],
    ["Cancel"]
  );
});

div.child(button);

root.child(container, div);

root.on(Event.windowResized, () => {
  div.rect.width = vw(100);
  button.rect.x = vw(100) - button.rect.width;
});

root.on(Event.tick, () => {
  if (freeze) return;
  div.text = Shell.localVars.workingDir;
  try {
    container.children = Files(div.rect.height);
  } catch (e) {
    Shell.localVars.workingDir = getPath(
      "/" + Shell.localVars.workingDir + "/.."
    );
  }
});

await run();
