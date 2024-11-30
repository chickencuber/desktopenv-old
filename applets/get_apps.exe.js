const { Event, Button, Div, Element, root, vw, vh, Img } = await use("~/../ui.exe");

let scroll = 0;

root.on(Event.keyPressed, (key) => {
    if (key === UP_ARROW && scroll > 0) {
        scroll -= 10;
    } else if (key === DOWN_ARROW && y > Shell.size.height) {
        scroll += 10;
    }
    for(const button of root.children) {
        button.rect.y = button.props.y + scroll;
    }
});

const apps = Object.entries(getFile("/user/desktop/apps")).map(v => JSON.parse(v)); 
let y = 0;
for(const [name, app] of apps) {
    if(!name.endsWith(".json")) continue;
    const temp = new Button({text: app.name, style: {
        color: "white",
        border_width: 0,
        background: "#40464e",
    }});
    if(app.terminal_app) {
        temp.on(Event.mousePressed, () => {
            Shell.createWindow(getPath("~/../terminal/main.exe") + " " + app.path)
            Shell.close();
        });
    } else {
        temp.on(Event.mousePressed, () => {
            Shell.createWindow(app.path)
            Shell.close();
        });
    }
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
