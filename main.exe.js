const { Event, Button, Div, Element, root, vw, vh, Img } = await use(
    "~/ui.exe"
);

const windows = new Div();
windows.rect.width = 0;
windows.rect.height = 0;

const { fakeShell } = await use("~/fakeShell.exe");

class App extends Element {
    async _start() {
        this.shell = fakeShell(
            () => Shell.gl.mouse.x - this.getRect().x,
            () => Shell.gl.mouse.y - this.getRect().y,
            () => this.getRect().width,
            () => this.getRect().height,
            this.getRect().width,
            this.getRect().height
        );
        this.shell.createWindow = this.props.createWindow;
        this.on(Event.keyPressed, (...args) => {
            this.shell.keyPressed(...args);
        });
        this.on(Event.keyReleased, (...args) => {
            this.shell.keyReleased(...args);
        });
        this.on(Event.mouseClicked, (...args) => {
            this.shell.mouseClicked(...args);
        });
        this.on(Event.mouseDragged, (...args) => {
            this.shell.mouseDragged(...args);
        });
        this.on(Event.mousePressed, (...args) => {
            this.shell.mousePressed(...args);
        });
        this.on(Event.mouseReleased, (...args) => {
            this.shell.mouseReleased(...args);
        });
        this.on(Event.mouseMoved, (...args) => {
            this.shell.mouseMoved(...args);
        });
        this.pw = this.getRect().width;
        this.ph = this.getRect().height;

        await this.shell.run(this.props.app);
        this.remove();
    }
    _default() {
        this.rect = {
            autosize: false,
            absolute: true,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        };
    }
    render() {
        let { x, y, width, height } = this.getRect();
        const collide = this.collide();
        const {
            border_width = this.style.border_width ?? 2,
            border_color = this.style.border_color ?? "#000000",
        } = collide ? this.style_hover : this.style;
        if (this.shell.gl.ready) {
            this.shell.gl.draw();
            Shell.gl.canvas.stroke(border_color);
            Shell.gl.canvas.strokeWeight(border_width);
            Shell.gl.canvas.rect(
                x + border_width / 2,
                y + border_width / 2,
                width,
                height
            );
            Shell.gl.canvas.image(
                this.shell.gl.canvas,
                x + border_width / 2,
                y + border_width / 2,
                width,
                height
            );
        }
        if (this.pw !== width || this.ph !== height) {
            this.pw = width;
            this.ph = height;
            this.shell.windowResized();
        }
    }
}

const shells = [];

function createWindow(app) {
    const window = new Div({
        style: {
            background: "white",
        },
    });
    window.rect.width = 410;
    window.rect.height = 420;

    const name = new Div();
    name.rect.autosize = false;
    name.rect.absolute = false;
    name.rect.width = 0;
    name.rect.height = 0;
    name.rect.border_width = 0;
    name.rect.x = 4;
    name.style.size = 14;

    window.child(name);

    const change = new Button({
        text: "🗖",
        style: {
            size: 13,
            margin_left: 3,
            margin_top: -1.5,
            font: Shell.gl.fonts.Symbols,
        },
    });

    const button = new Button({
        text: "🗙",
        style: {
            background: "red",
            color: "rgb(145,0,0)",
            size: 15,
            margin_left: 1.5,
            margin_top: -4,
            font: Shell.gl.fonts.Symbols,
        },
        style_hover: {
            background: "rgb(145,0,0)",
            color: "red",
        },
    });

    change.rect.width = 18;
    change.rect.height = 15;
    change.rect.autosize = false;
    change.rect.absolute = false;

    button.rect.width = 15;
    button.rect.height = 15;

    button.rect.absolute = false;

    change.rect.x = vw(100, window) - 38;

    button.rect.x = vw(100, window) - 15;

    window.child(button, change);

    const temp = new App({
        props: {
            app,
            createWindow,
        },
    });
    temp.rect.absolute = false;
    temp.rect.y = 15;
    temp.rect.x = 4;

    if(!temp.shell.icon) {
        temp.shell.icon = loadImage(getFile("~/icons/default.png"));
    }

    shells.push(temp.shell);

    temp.on(Event.tick, () => {
        if (window.rect.width < 207) {
            name.text = "";
            return;
        }
        name.text = temp.shell.name || app;
        if (name.text.length >= 25) {
            name.text = name.text.slice(0, 23) + "...";
        }
    });

    let allow = true;

    const resize = new Div();
    resize.rect.width = 5;
    resize.rect.height = 5;
    resize.rect.absolute = false;
    resize.rect.x = vw(100, window) - 5;
    resize.rect.y = vh(100, window) - 5;
    resize.style.background = "#aaaaaa";

    let rcx, rcy;
    let rdrag = false;
    resize.on(Event.mousePressed, () => {
        if (createWindow.dragging) return;
        if (!allow) return;
        rcx = resize.rect.x - Shell.gl.mouse.x;
        rcy = resize.rect.y - Shell.gl.mouse.y;
        rdrag = true;
        createWindow.dragging = true;
    });
    root.on(Event.mouseMoved, () => {
        if (!rdrag) return;
        const px = resize.rect.x;
        const py = resize.rect.y;
        const pw = window.rect.width;
        const ph = window.rect.height;
        resize.rect.x = Shell.gl.mouse.x + rcx;
        resize.rect.y = Shell.gl.mouse.y + rcy;
        window.rect.width = resize.rect.x + 5;
        window.rect.height = resize.rect.y + 5;
        if (window.rect.width < 100) {
            resize.rect.x = px;
            window.rect.width = pw;
        } else {
            temp.rect.width = window.rect.width - 10;
        }
        if (window.rect.height < 100) {
            resize.rect.y = py;
            window.rect.height = ph;
        } else {
            temp.rect.height = window.rect.height - 20;
        }
        button.rect.x = vw(100, window) - 15;
        change.rect.x = vw(100, window) - 38;
    });
    root.on(Event.mouseReleased, () => {
        if (!rdrag) return;
        rdrag = false;
        createWindow.dragging = false;
    });

    window.child(resize);

    temp.on(Event.removed, () => {
        window.remove();
        shells.splice(shells.indexOf(temp.shell), 1);
    });

    button.on(Event.mousePressed, () => {
        temp.shell.exit = true;
    });
    window.child(temp);
    let cx, cy;
    let drag = false;
    window.on(Event.mousePressed, () => {
        if (createWindow.dragging) return;
        if (button.collide()) return;
        windows.children.splice(windows.children.indexOf(window), 1);
        windows.child(window);
        if (!allow) return;
        if (window.children.some((v) => v.collide())) return;
        cx = window.rect.x - Shell.gl.mouse.x;
        cy = window.rect.y - Shell.gl.mouse.y;
        drag = true;
        createWindow.dragging = true;
    });
    root.on(Event.mouseMoved, () => {
        if (!drag) return;
        window.rect.x = Shell.gl.mouse.x + cx;
        window.rect.y = Shell.gl.mouse.y + cy;
    });
    root.on(Event.mouseReleased, () => {
        if (!drag) return;
        drag = false;
        createWindow.dragging = false;
    });
    windows.child(window);

    let px, py, pw, ph;

    function r() {
        window.rect.width = resize.rect.x + 5;
        window.rect.height = resize.rect.y + 5;
        temp.rect.width = window.rect.width - 10;
        temp.rect.height = window.rect.height - 20;
        change.rect.x = vw(100, window) - 38;

        button.rect.x = vw(100, window) - 15;
    }

    change.on(Event.mousePressed, () => {
        allow = !allow;
        if (allow) {
            change.style.font_weight = undefined;
            change.text = "🗖";
            window.rect.x = px;
            window.rect.y = py;
            resize.rect.x = pw;
            resize.rect.y = ph;
            r();
        } else {
            px = window.rect.x;
            py = window.rect.y;
            pw = resize.rect.x;
            ph = resize.rect.y;
            change.text = "🗗";
            window.rect.x = 0;
            window.rect.y = 0;
            resize.rect.x = vw(100) - resize.rect.width;
            resize.rect.y = vh(100) - resize.rect.height;
            r();
        }
        window.on(Event.windowResized, () => {
            if (allow) return;
            resize.rect.x = vw(100) - resize.rect.width;
            resize.rect.y = vh(100) - resize.rect.height;
            r();
        });
    });

    return temp.shell;
}

createWindow.dragging = false;

const background = new Img();
background.props.image = loadImage(getFile("~/wallpapers/default.png"));
background.rect.width = root.rect.width;
background.rect.height = root.rect.height;

const button = new Button({
    text: "O",
    style: {
        color: "white",
        border_width: 0,
        border_radius: 100,
        background: "#40464e",
        margin_top: 9,
        margin_left: 9,
    },
});

button.rect.x = 3;
button.rect.y = 3;
button.rect.width = 35;
button.rect.height = 35;

button.rect.absolute = false;

const bar = new Div({
    style: {
        border_width: 0,
        background: "#252d35",
        border_radius: 20,
    },
});

bar.child(button);
bar.rect.width = root.rect.width;
bar.rect.height = 80;
bar.rect.y = vh(100);

root.on(Event.windowResized, () => {
    background.rect.width = root.rect.width;
    background.rect.height = root.rect.height;
    bar.rect.width = root.rect.width;
    bar.rect.y = vh(100) - c;
    menu.rect.y = vh(100) - 42 - menu.rect.height;
});

root.on(Event.mousePressed, () => {
    if (!amenu) return;
    if (!menu.collide() && !bar.collide()) {
        amenu = false;
        button.style.background = "#40464e";
        button.style.color = "white";
        return;
    }
});

let c = 0;
let i = 0;
const f = 20;

let amenu = false;

const menu = new Div({
    style: {
        background: "#252d35",
        border_width: 0,
        border_radius: 20,
    },
});

menu.rect.width = 400;
menu.rect.height = 400;
menu.rect.x = -menu.rect.width;
menu.rect.y = vh(100) - 42 - menu.rect.height;

const close = new Button({text: "⏻", style: {
    border_width: 0,
    background: "#40464e",
    color: "white",
    border_radius: 100,
    margin_top: -2,
    margin_left: 2.5,
    font: Shell.gl.fonts.Symbols,
}});

close.rect.absolute = false;
close.rect.width = close.rect.height;
close.rect.x = vw(50, menu);
close.rect.y = vh(100, menu) - close.rect.height - 5;

menu.child(close);

let mc = 0;

let apps = {
    remove(){},
    shell: {

    }
}

button.on(Event.mousePressed, () => {
    amenu = !amenu;
    if (amenu) {
        button.style.background = "#98cbff";
        button.style.color = "#40464e";
        apps.shell.exit = true;
        apps = new App({
            props: {
                app: getPath("~/applets/get_apps.exe"),
                createWindow,
            },
            style: {
                border_width: 0,
            }
        }); 
        apps.shell.close = () => {
            amenu = false;
            button.style.background = "#40464e";
            button.style.color = "white";
            return;
        }
        apps.rect.absolute = false;
        apps.rect.x = vw(50, menu);
        apps.rect.y = 10;
        apps.rect.height = vh(100, menu) - close.rect.height - 20;
        apps.rect.width = vw(50, menu) - 50;
        menu.child(apps);
    } else {
        button.style.background = "#40464e";
        button.style.color = "white";
    }
});

root.on(Event.keyPressed, (keyCode) => {
    if(keyCode === ALT) {
        amenu = !amenu;
        if (amenu) {
            button.style.background = "#98cbff";
            button.style.color = "#40464e";
            apps.shell.exit = true;
            apps = new App({
                props: {
                    app: getPath("~/applets/get_apps.exe"),
                    createWindow,
                },
                style: {
                    border_width: 0,
                }
            }); 
            apps.shell.close = () => {
                amenu = false;
                button.style.background = "#40464e";
                button.style.color = "white";
                return;
            }

            apps.rect.absolute = false;
            apps.rect.x = vw(50, menu);
            apps.rect.y = 10;
            apps.rect.height = vh(100, menu) - close.rect.height - 20;
            apps.rect.width = vw(50, menu) - 50;
            menu.child(apps);
        } else {
            button.style.background = "#40464e";
            button.style.color = "white";
        }
    } 
});

root.on(Event.tick, () => {
    bar.rect.y = vh(100) - c;
    menu.rect.x = -menu.rect.width + mc;

    if (amenu) {
        mc += 20;
        if (mc > menu.rect.width / 2) {
            mc = menu.rect.width / 2;
        }
    } else {
        mc -= 20;
        if (mc < 0) {
            mc = 0;
        }
    }
    if (
        Shell.gl.mouse.y > root.rect.height - 10 ||
        amenu ||
        (c === bar.rect.height / 2 &&
            Shell.gl.mouse.y > root.rect.height - bar.rect.height / 2)
    ) {
        i++;
        if (i > f || amenu) {
            c += 5;
            if (c > bar.rect.height / 2) {
                c = bar.rect.height / 2;
            }
        }
    } else {
        if (c > 0) {
            c -= 5;
            if (c < 0) c = 0;
        }
        i = 0;
    }
});

root.child(background, windows, bar, menu);

Shell.onExit = () => {
    shells.forEach((v) => (v.exit = true));
    apps.shell.exit = true;
};

await run((r) => {
    close.on(Event.mousePressed, () => {
        r();
    })
});
