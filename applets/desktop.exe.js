const { Event, Button, Div, Element, root, vw, vh, Img } = await use("~/../ui.exe");

const background = new Img({style: {
    border_width: 0,
}});
background.props.image = loadImage(getFile("~/../wallpapers/default.png"));
background.rect.width = root.rect.width;
background.rect.height = root.rect.height;

const cont = new Div({style: {
    border_width: 0,
}})

root.child(background, cont);

const w = 45;
const h = 45;

let cache = {};

root.on(Event.tick, () => {
    cont.children = [];
    const apps = Object.entries(getFile("/user/desktop/desktop")).map(([k, v]) => [k, JSON.parse(v)]); 
    let y = 0;
    for(const [name, app] of apps) {
        if(!name.endsWith(".json")) continue;
        const temp = new Button({text: app.name, style: {
            color: "white",
            border_width: 0,
            background: "#00000033",
        }});
        temp.rect.height = 23;
        let i;
        if(cache[app.icon]) {
            i = cache[app.icon];
        } else {
            i = loadImage(FS.getFromPath(app.icon)); 
            cache[app.icon] = i;
        }
        const image = new Img({
            props: {
                image: i,
            },
            style: {
                border_width: 0,
            }
        });
        if(app.terminal_app) {
            const func = (mouseButton) => {
                if(mouseButton === RIGHT) {
                    Shell.createContextMenu([
                        [
                            "Remove Desktop Shortcut", () => {
                                 FS.delete(`/user/desktop/desktop/${name}`);
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
                            "Remove Desktop Shortcut", () => {
                                FS.delete(`/user/desktop/desktop/${name}`);
                            }
                        ]
                    ])
                    return;
                }
                Shell.createWindow(app.path)
            };
            image.on(Event.mousePressed, func);
            temp.on(Event.mousePressed, func);
        }
        image.rect.width = w;
        image.rect.height = h;
        image.rect.y = y;
        temp.rect.y = y + image.rect.height;
        y += image.rect.height + temp.rect.height + 5;
        cont.child(image, temp);
    }
});

root.on(Event.windowResized, () => {
    background.rect.width = root.rect.width;
    background.rect.height = root.rect.height;
});

root.on(Event.mousePressed, (mouseButton) => {
    if(cont.children.some(v => v.collide()) || Shell.collide()) return;
    if(mouseButton === RIGHT) {
        Shell.createContextMenu([
            [
                "Clear Icon Cache",
                () => cache = {},
            ]
        ])
    }
});

await run();
