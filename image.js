const { Event, Button, Div, Element, root, vw, vh, Img } = await use(
  "~/ui.exe"
);

if (!args[0]) return "requires arg";

Shell.name = args[0].toPath();

const img = new Img();

const src = FS.getFromPath(args[0].toPath());

img.props.image = loadImage(src, () => {
  const wa = img.props.image.width;
  const ha = img.props.image.height;

  const a = wa / ha;
  function resize() {
    const w = root.rect.width;
    const h = root.rect.height;
    let nw = 0;
    let nh = 0;
    if (w/h<a) {
      nw = w;
      nh = w / a;
    } else {
      nw = a * h;
      nh = h;
    }
    img.rect.width = nw;
    img.rect.height = nh;
    img.rect.x = vw(50) - nw / 2;
    img.rect.y = vh(50) - nh / 2;
  }

  resize();

  root.child(img);

  root.on(Event.windowResized, () => {
    resize();
  });
});

return await run();
