const { Event, Button, Div, Element, root, vw, vh, Img } = await use("~/../ui.exe");

let scroll = 0;

root.on(Event.mouseWheel, (_, _y) => {
    if (_y < 0 && scroll > 0) {
        scroll += _y / 12;
    } else if (_y > 0 && y > Shell.size.height) {
        scroll += _y / 12;
    }
    for(const button of root.children) {
        button.rect.y = button.props.y + scroll;
    }
});

const apps = Object.entries(getFile("/user/desktop-old/apps")).map(([k, v]) => [k, JSON.parse(v)]); 
let y = 0;
for(const [name, app] of apps) {
    if(!name.endsWith(".json")) continue;
    const temp = new Button({text: app.name, style: {
        color: "white",
        border_width: 0,
        background: "#40464e",
    }});
    temp.rect.height = 23;
    temp.rect.x =25;
    const image = new Img({
        props: {
            image: loadImage(FS.getFromPath(app.icon)),
        },
        style: {
            border_width: 1,
            border_color: "#40464e",
        }
    });
    if(app.terminal_app) {
        const func = (mouseButton) => {
            if(mouseButton === RIGHT) {
                Shell.createContextMenu([
                    [
                        "Create Desktop Shortcut", () => {
                            FS.addFile(`/user/desktop-old/desktop/${name}`, JSON.stringify(app));
                        }
                    ]
                ])
                return;
            }
            Shell.createWindow(getPath("~/../terminal/main.exe") + " " + app.path)
            Shell.close();
        };
        image.on(Event.mousePressed, func);
        temp.on(Event.mousePressed, func);
    } else {
        const func = (mouseButton) => {
            if(mouseButton === RIGHT) {
                Shell.createContextMenu([
                    [
                        "Create Desktop Shortcut", () => {
                            FS.addFile(`/user/desktop-old/desktop/${name}`, JSON.stringify(app));
                        }
                    ]
                ])
                return;
            }
            Shell.createWindow(app.path)
            Shell.close();
        };
        image.on(Event.mousePressed, func);
        temp.on(Event.mousePressed, func);
    }
    image.rect.width = 23;
    image.rect.height = 23;
    image.props.y = y;
    temp.props.y = y;
    y += temp.rect.height + 5;
    root.child(image, temp);
}

for(const button of root.children) {
    button.rect.y = button.props.y + scroll;
}

root.style.background = "#252d35"

await run();
