const { Event, Button, Div, Element, root, vw, vh, Img } = await use("~/../ui.exe");

root.style.background = "#252d35"; 

root.on(Event.tick, () => {
    root.children = [];
    if(Shell.apps) {
        /**
            * @type {{name: string, icon: Image, focus: ()=>void}[]}
            */
        const apps = Shell.apps().map(v => ({icon: v.icon, name: v.name, focus: v.focus}));
        let x = 0;
        for(const app of apps) {
            const temp = new Img({
                props: {
                    image: app.icon,
                },
                style: {
                    border_width: 0,
                }
            });
            root.child(temp);
            temp.rect.x = x;
            temp.rect.width = root.rect.height - 5;
            temp.rect.height = root.rect.height - 5;
            temp.rect.y = vh(50) - temp.rect.height / 2;
            x+= temp.rect.width + 5;
            temp.on(Event.mousePressed, app.focus); 
        }
    }
})

