const { Event, Button, Div, Element, root, vw, vh } = await use("~/ui.exe");

let scroll = 0;

root.on(Event.keyPressed, (key) => {
    if (key === UP_ARROW && scroll > 0) {
        scroll -= 10;
    } else if (key === DOWN_ARROW && height > Shell.size.height) {
        scroll += 10;
    }
    for(const button of root.children) {
        button.rect.y = button.props.y + scroll;
    }
});

const apps = Object.values(FS.getFromPath(getPath("~/apps"))).map(v => JSON.parse(v)); 
let y = 0;
for(const app of apps) {
    const temp = new Button({text: app.name})
    if(app.terminal_app) {
        temp.on(Event.mousePressed, () => Shell.createWindow(getPath("~/terminal/main.exe") + " " + app.path));
    } else {
        temp.on(Event.mousePressed, () => Shell.createWindow(app.path));
    }
    temp.props.y = y;
    y += temp.rect.height;
    root.child(temp);
}

for(const button of root.children) {
    button.rect.y = button.props.y + scroll;
}

await run();
