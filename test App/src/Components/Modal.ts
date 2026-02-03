import { Material, vec, Color, Engine, PointerEvent, Subscription } from "excalibur";
import { UIPanel, UIButton, UILabel } from "../../../excalibur-ui/Components";

export class ShowModal extends UIPanel {
  material: Material | null = null;
  pdownSub: Subscription | null = null;
  pupSub: Subscription | null = null;
  penterSub: Subscription | null = null;
  pexitSub: Subscription | null = null;
  pmoveSub: Subscription | null = null;
  constructor() {
    super({
      name: "showModal",
      width: 800,
      height: 600,
      pos: vec(0, 0),
      z: 100,
      colors: {
        backgroundStarting: Color.fromHex("#00000095"),
      },
    });

    const innerModal = new InnerModal();
    this.addChild(innerModal);
  }

  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      name: "background",
      fragmentSource: blurShader,
    });
    this.graphics.material = this.material;
  }

  onAdd(): void {
    this.pdownSub = this.on("pointerdown", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.pupSub = this.on("pointerup", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.pmoveSub = this.on("pointermove", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.penterSub = this.on("pointerenter", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.pexitSub = this.on("pointerleave", (evt: PointerEvent) => {
      document.body.style.cursor = "default";
      evt.cancel();
    });
  }
  onRemove(): void {
    this.pupSub?.close();
    this.pdownSub?.close();
    this.pmoveSub?.close();
    this.penterSub?.close();
    this.pexitSub?.close();
  }
}

class InnerModal extends UIPanel {
  constructor() {
    super({
      name: "innerModal",
      width: 200,
      height: 200,
      pos: vec(400 - 100, 300 - 100),
      z: 101,
      borderWidth: 2,
      colors: {
        backgroundStarting: Color.fromHex("#ffffff"),
        borderColor: Color.fromHex("#000000"),
      },
    });
    let btn = new UIButton({
      name: "close",
      width: 100,
      height: 30,
      pos: vec(100 - 50, 200 - 50),
      z: 101,
      colors: {
        mainStarting: Color.fromHex("#dcdcdc"),
        mainEnding: Color.fromHex("#939393"),
        hoverStarting: Color.fromHex("#dcdcdc"),
        hoverEnding: Color.fromHex("#939393"),
        bottomStarting: Color.fromHex("#4f4f4f"),
        bottomEnding: Color.fromHex("#4f4f4f"),
      },
      idleText: "Close",
      hoveredText: "Close",
      activeText: "Close",
      buttonRadius: 5,
      callback: () => {
        this.parent?.kill();
      },
    });
    btn.emitter.on("UIButtonHovered", () => {
      document.body.style.cursor = "pointer";
    });
    btn.emitter.on("UIButtonUnhovered", () => {
      document.body.style.cursor = "default";
    });
    btn.onRemove = () => {
      document.body.style.cursor = "default";
    };
    this.addChild(btn);
    this.addChild(
      new UILabel({
        name: "modalLabel",
        width: 190,
        height: 150,
        pos: vec(5, 5),
        z: 101,
        text: `My modal text here!!!!`,
      }),
    );
  }
}

const blurShader = `#version 300 es
precision mediump float;

in vec2 v_screenuv;
out vec4 fragColor;

uniform sampler2D u_screen_texture;
uniform vec2 u_resolution;

const float radius = 2.5;
const float darkness = 0.65;

void main() {
    vec2 texel = 1.0 / u_resolution;
    vec2 uv = vec2(v_screenuv.x, 1.0 - v_screenuv.y);

    vec4 sum = vec4(0.0);
    float total = 0.0;

    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 offset = vec2(float(x), float(y)) * texel * radius;
            sum += texture(u_screen_texture, uv + offset);
            total += 1.0;
        }
    }

    vec4 color = sum / total;

    // darken result
    vec3 darkened = color.rgb * (1.0 - darkness);

    fragColor = vec4(darkened, color.a);
}


`;
