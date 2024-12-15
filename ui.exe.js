let focus = [];

const default_font = Shell.gl.fonts.Arial;

const Event = {
    keyPressed: "keyPressed",
    keyReleased: "keyReleased",
    mouseClicked: "mouseClicked",
    mouseDragged: "mouseDragged",
    mousePressed: "mousePressed",
    mouseReleased: "mouseReleased",
    mouseMoved: "mouseMoved",
    windowResized: "windowResized",
    removed: "removed",
    tick: "tick",
};

class Element {
    get text() {
        return this._text;
    }
    set text(v) {
        this._text = v.toString();
        const { x, y, absolute, autosize } = this.rect;
        if (autosize) {
            this._default();
            this.rect.x = x;
            this.rect.y = y;
            this.rect.absolute = absolute;
            this.rect.autosize = autosize;
        }
    }
    constructor({ style = {}, style_hover = {}, props = {}, text = "" } = {}) {
        this.style = style;
        this.style_hover = style_hover;
        this.rect = {};
        this.props = props;
        this._text = text;
        this.children = [];
        this._keyPressed = [];
        this._keyReleased = [];
        this._mouseClicked = [];
        this._mouseDragged = [];
        this._mousePressed = [];
        this._mouseReleased = [];
        this._mouseMoved = [];
        this._windowResized = [];
        this._removed = [];
        this._tick = [];
        this.parent = null;
        this._default();
        this._start();
    }
    remove() {
        if (!this.parent) throw new Error("there is no parent to element");
        if(this.focused) focus.splice(focus.indexOf(this), 1);
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
        this.removed();
    }
    _start() {}
    on(txt, func) {
        try {
            this["_" + txt].push(func);
        } catch (e) {
            throw new Error("not defined");
        }
    }
    removeEvent(txt, func) {
        try {
            this["_" + txt].splice(this["_" + txt].indexOf(func), 1);
        } catch (e) {
            throw new Error("not defined");
        }
    }
    getRect() {
        const parent = this.parent;
        let { absolute, x, y, width, height } = this.rect;

        if (!absolute) {
            x += parent?.getRect().x ?? 0;
            y += parent?.getRect().y ?? 0;
        }
        return { x, y, width, height };
    }
    collide() {
        const { x, y, width: w, height: h } = this.getRect();
        const { x: mx, y: my } = Shell.gl.mouse;
        return mx >= x && mx <= x + w && my >= y && my <= y + h;
    }
    child(...children) {
        for (const c of children) {
            c.parent = this;
            this.children.push(c);
        }
    }
    _render() {
        this.render();
        this.children.forEach((v) => v._render());
    }
    tick() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].tick();
        }
        this._tick.forEach((v) => v());
        return true;
    }
    keyPressed(keyCode, key) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].keyPressed(keyCode, key)) {
                break;
            }
        }
        if (this.focused) {
            this._keyPressed.forEach((v) => v(keyCode, key));
            return true;
        }
        return false;
    }
    keyReleased(keyCode, key) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].keyReleased(keyCode, key)) {
                break;
            }
        }
        if (this.focused) {
            this._keyReleased.forEach((v) => v(keyCode, key));
            return true;
        }
        return false;
    }
    mouseClicked(mouseButton) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].mouseClicked(mouseButton)) {
                break;
            }
        }
        if (this.collide()) {
            this._mouseClicked.forEach((v) => v(mouseButton));
            return true;
        } else if (this.focused) {
            focus.splice(focus.indexOf(this), 1);
        }
        return false;
    }
    mouseDragged() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].mouseDragged()) {
                break;
            }
        }
        if (this.collide()) {
            this._mouseDragged.forEach((v) => v());
            return true;
        }
        return false;
    }
    mousePressed(mouseButton) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].mousePressed(mouseButton)) {
                break;
            }
        }
        if (this.collide()) {
            if(!this.focused) focus.push(this);
            this._mousePressed.forEach((v) => v(mouseButton));
            return true;
        } else if (this.focused) {
            focus.splice(focus.indexOf(this), 1);
        }
        return false;
    }
    mouseReleased(mouseButton) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].mouseReleased(mouseButton)) {
                break;
            }
        }
        if (this.collide()) {
            this._mouseReleased.forEach((v) => v(mouseButton));
            return true;
        }
        return false;
    }
    removed() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].removed();
        }
        this._removed.forEach((v) => v());
        return true;
    }
    mouseMoved() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (this.children[i].mouseMoved()) {
                break;
            }
        }
        if (this.collide()) {
            this._mouseMoved.forEach((v) => v());
            return true;
        }
        return false;
    }
    windowResized() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].windowResized();
        }
        this._windowResized.forEach((v) => v());
        return true;
    }
    render() {}
    get focused() {
        return focus.includes(this);
    }
    focus() {
        if(!this.focused) focus.push(this);
    }
    _default() {}
}

class RootElement extends Element {
    render() {
        Shell.gl.canvas.background(this.style.background ?? "#000000");
    }
    _default() {
        this.rect = {
            autosize: true,
            absolute: true,
            x: 0,
            y: 0,
            get width() {
                return Shell.size.width;
            },
            get height() {
                return Shell.size.height;
            },
        };
    }
}

class Button extends Element {
    _default() {
        this.rect = {
            autosize: true,
            absolute: true,
            x: 0,
            y: 0,
            width: 12 * Math.max(...this.text.split("\n").map((v) => v.length)),
            height: 23 * this.text.split("\n").length,
        };
    }
    render() {
        let { x, y, width, height } = this.getRect();
        const collide = this.collide();
        const {
            background = this.style.background ?? (collide ? "#aaaaaa" : "#ffffff"),
            color = this.style.color ?? "#000000",
            size = this.style.size ?? 20,
            border_radius = this.style.border_radius ?? 0,
            border_width = this.style.border_width ?? 2,
            border_color = this.style.border_color ?? "#000000",
            font_weight = this.style.font_weight ?? 0,
            font = this.style.font ?? default_font,
            margin_top = this.style.margin_top ?? 2,
            margin_left = this.style.margin_left ?? 2,
        } = collide ? this.style_hover : this.style;
        Shell.gl.canvas.fill(background);
        Shell.gl.canvas.stroke(border_color);
        Shell.gl.canvas.strokeWeight(border_width);
        Shell.gl.canvas.rect(x, y, width, height, border_radius);
        Shell.gl.canvas.fill(color);
        Shell.gl.canvas.strokeWeight(font_weight);
        Shell.gl.canvas.textAlign(LEFT, TOP);
        Shell.gl.canvas.textSize(size);
        if (font) Shell.gl.canvas.textFont(font);
        Shell.gl.canvas.text(this.text, x + margin_left, y + margin_top);
    }
}

class Div extends Element {
    _default() {
        this.rect = {
            autosize: true,
            absolute: true,
            x: 0,
            y: 0,
            width: 12 * Math.max(...this.text.split("\n").map((v) => v.length)),
            height: 23 * this.text.split("\n").length,
        };
    }
    render() {
        let { x, y, width, height } = this.getRect();

        const collide = this.collide();
        const {
            background = this.style.background ?? "#00000000",
            color = this.style.color ?? "#000000",
            size = this.style.size ?? 20,
            border_radius = this.style.border_radius ?? 0,
            border_width = this.style.border_width ?? 2,
            border_color = this.style.border_color ?? "#000000",
            font_weight = this.style.font_weight ?? 0,
            font = this.style.font ?? default_font,
            margin_top = this.style.margin_top ?? 2,
            margin_left = this.style.margin_left ?? 2,
        } = collide ? this.style_hover : this.style;
        Shell.gl.canvas.fill(background);
        Shell.gl.canvas.stroke(border_color);
        Shell.gl.canvas.strokeWeight(border_width);
        Shell.gl.canvas.rect(x, y, width, height, border_radius);
        Shell.gl.canvas.fill(color);
        Shell.gl.canvas.strokeWeight(font_weight);
        Shell.gl.canvas.textAlign(LEFT, TOP);
        Shell.gl.canvas.textSize(size);
        if (font) Shell.gl.canvas.textFont(font);
        Shell.gl.canvas.text(this.text, x + margin_left, y + margin_top);
    }
}

class Img extends Element {
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
        Shell.gl.canvas.fill(border_color);
        if(border_width !== 0) Shell.gl.canvas.rect(
            x + border_width / 2,
            y + border_width / 2,
            width,
            height
        );
        if (this.props.image) {
            Shell.gl.canvas.image(
                this.props.image,
                x + border_width / 2,
                y + border_width / 2,
                width,
                height
            );
        }
    }
}

const root = new RootElement();

focus.push(root);

Shell.gl.draw = () => {
    root.tick();
    root._render();
};

Shell.gl.new();

Shell.windowResized = () => {
    Shell.gl.resize();
    root.windowResized();
};

Shell.keyPressed = (keyCode, key) => {
    root.keyPressed(keyCode, key);
};
Shell.keyReleased = (keyCode, key) => {
    root.keyReleased(keyCode, key);
};
Shell.mouseClicked = (mouseButton) => {
    root.mouseClicked(mouseButton);
};
Shell.mouseDragged = () => {
    root.mouseDragged();
};
Shell.mousePressed = (mouseButton) => {
    root.mousePressed(mouseButton);
};
Shell.mouseReleased = (mouseButton) => {
    root.mouseReleased(mouseButton);
};
Shell.mouseMoved = () => {
    root.mouseMoved();
};

function vw(a, elt = root) {
    if (Array.isArray(a)) a = a[0];
    return (elt.rect.width ?? 0) * (parseFloat(a) / 100);
}

function vh(a, elt = root) {
    if (Array.isArray(a)) a = a[0];
    return (elt.rect.height ?? 0) * (parseFloat(a) / 100);
}

return {
    Element,
    Button,
    Div,
    root,
    vw,
    vh,
    Event,
    Img,
};
