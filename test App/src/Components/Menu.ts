import { Color, Engine, PointerEvent, PointerEvents, Subscription, vec } from "excalibur";
import { UIImage, UILabel, UIPanel } from "../../../excalibur-ui/Components";
import { Resources } from "../resources";
import { ShowModal } from "./Modal";

class MenuExample {
  engine: Engine;
  fileIcon: UIImage;
  saveIcon: UIImage;
  helpIcon: UIImage;
  aboutLabel: UILabel;
  subMenu: UIPanel | null = null;
  clearSubmenuEvent: any;

  hoverFileIconSub: Subscription | null = null;
  hoverSaveIconSub: Subscription | null = null;
  hoverHelpIconSub: Subscription | null = null;
  hoverAboutLabelSub: Subscription | null = null;
  unhoverFileIconSub: Subscription | null = null;
  unhoverSaveIconSub: Subscription | null = null;
  unhoverHelpIconSub: Subscription | null = null;
  unhoverAboutLabelSub: Subscription | null = null;
  clickFileIconSub: Subscription | null = null;
  clickSaveIconSub: Subscription | null = null;
  clickHelpIconSub: Subscription | null = null;
  clickAboutLabelSub: Subscription | null = null;
  cancelFileIconSub: Subscription | null = null;
  cancelSaveIconSub: Subscription | null = null;
  cancelHelpIconSub: Subscription | null = null;
  cancelAboutLabelSub: Subscription | null = null;

  constructor(engine: Engine) {
    this.engine = engine;

    // System Panel at top
    const systemPanel = new UIPanel({
      name: "SystemPanel",
      width: 800,
      height: 36,
      pos: vec(0, 0),
      z: 10,
      colors: {
        backgroundStarting: Color.fromHex("#cacaca"),
        backgroundEnding: Color.fromHex("#636363"),
        borderColor: Color.fromHex("#636363"),
      },
      borderWidth: 2,
      panelRadius: 0,
    });

    // File Icon
    this.fileIcon = new UIImage({
      name: "fileIcon",
      width: 32,
      height: 32,
      pos: vec(4, 2),
      image: Resources.file.toSprite(),
      z: 10,
    });

    // Save Icon
    this.saveIcon = new UIImage({
      name: "saveIcon",
      width: 32,
      height: 32,
      pos: vec(48, 2),
      image: Resources.save.toSprite(),
      z: 10,
    });

    // Help Icon
    this.helpIcon = new UIImage({
      name: "helpIcon",
      width: 32,
      height: 32,
      pos: vec(86, 2),
      image: Resources.help.toSprite(),
      z: 10,
    });

    // About Label
    this.aboutLabel = new UILabel({
      name: "aboutLabel",
      width: 70,
      height: 32,
      pos: vec(800 - 85, 2),
      text: "About",
      z: 10,
      enableHover: true,
      colors: {
        backgroundStarting: Color.fromHex("#cacaca"),
        backgroundEnding: Color.fromHex("#636363"),
        hoverStarting: Color.fromHex("#cacaca"),
        hoverEnding: Color.fromHex("#cacaca"),
        textColor: Color.fromHex("#1e1e1e"),
        textHoverColor: Color.fromHex("#1e1e1e"),
      },
    });

    systemPanel.addChild(this.fileIcon);
    systemPanel.addChild(this.saveIcon);
    systemPanel.addChild(this.helpIcon);
    systemPanel.addChild(this.aboutLabel);

    systemPanel.onAdd = () => {
      this.hoverFileIconSub = this.fileIcon.emitter.on("UIImageHovered", () => {
        document.body.style.cursor = "pointer";
        this.fileIcon.changeBackGroundColor(Color.fromHex("#cacaca"));
      });
      this.hoverSaveIconSub = this.saveIcon.emitter.on("UIImageHovered", () => {
        document.body.style.cursor = "pointer";
        this.saveIcon.changeBackGroundColor(Color.fromHex("#cacaca"));
      });
      this.hoverHelpIconSub = this.helpIcon.emitter.on("UIImageHovered", () => {
        document.body.style.cursor = "pointer";
        this.helpIcon.changeBackGroundColor(Color.fromHex("#cacaca"));
        if (!this.subMenu) {
          this.subMenu = new SubMenu(this.helpIcon);
          systemPanel.addChild(this.subMenu);
          this.clearSubmenuEvent = this.subMenu.events.on("kill", () => (this.subMenu = null));
        }
      });
      this.hoverAboutLabelSub = this.aboutLabel.emitter.on("UILabelHovered", () => {
        document.body.style.cursor = "pointer";
      });

      this.unhoverFileIconSub = this.fileIcon.emitter.on("UIImageUnhovered", () => {
        document.body.style.cursor = "default";
        this.fileIcon.changeBackGroundColor(Color.fromHex("#cacaca00"));
      });
      this.unhoverSaveIconSub = this.saveIcon.emitter.on("UIImageUnhovered", () => {
        document.body.style.cursor = "default";
        this.saveIcon.changeBackGroundColor(Color.fromHex("#cacaca00"));
      });
      this.unhoverHelpIconSub = this.helpIcon.emitter.on("UIImageUnhovered", () => {
        document.body.style.cursor = "default";
        this.helpIcon.changeBackGroundColor(Color.fromHex("#cacaca00"));
      });
      this.unhoverAboutLabelSub = this.aboutLabel.emitter.on("UILabelUnhovered", () => {
        document.body.style.cursor = "default";
      });

      this.clickFileIconSub = this.fileIcon.emitter.on("UIImageClicked", () => {
        this.engine.add(new ShowModal());
      });
    };
    systemPanel.onRemove = () => {
      this.hoverFileIconSub?.close();
      this.hoverSaveIconSub?.close();
      this.hoverHelpIconSub?.close();
      this.hoverAboutLabelSub?.close();
      this.unhoverFileIconSub?.close();
      this.unhoverSaveIconSub?.close();
      this.unhoverHelpIconSub?.close();
      this.unhoverAboutLabelSub?.close();
    };
    this.engine.add(systemPanel);
  }
}

export function initializeMenuDemo(engine: Engine): MenuExample {
  return new MenuExample(engine);
}

class SubMenu extends UIPanel {
  isHeaderHovered: boolean = false;
  header: UILabel | UIImage;
  closeTimer: number = 0;
  closeLimit: number = 300;
  pdownSub: Subscription | null = null;
  pupSub: Subscription | null = null;
  penterSub: Subscription | null = null;
  pexitSub: Subscription | null = null;
  pmoveSub: Subscription | null = null;

  constructor(header: UILabel | UIImage) {
    super({
      name: "subMenu",
      width: 200,
      height: 40,
      pos: vec(86, -200),
      z: -1,

      panelRadius: 0,
      colors: {
        backgroundStarting: Color.fromHex("#e0e0e0"),
        borderColor: Color.fromHex("#000000"),
      },
    });

    this.header = header;

    let label = new UILabel({
      name: "submenulabel",
      width: 140,
      height: 32,
      pos: vec(10, 2),
      text: "Submenu",
      z: 0,
      enableHover: true,
      colors: {
        backgroundStarting: Color.fromHex("#cacaca00"),
        backgroundEnding: Color.fromHex("#63636300"),
        hoverStarting: Color.fromHex("#cacaca"),
        hoverEnding: Color.fromHex("#cacaca"),
        textColor: Color.fromHex("#1e1e1e"),
        textHoverColor: Color.fromHex("#1e1e1e"),
      },
    });
    label.onClick = () => new ShowModal();

    this.addChild(label);
  }
  onAdd(en: Engine): void {
    super.onAdd(en);
    console.log("running child onadd");

    this.actions
      .moveTo({ pos: vec(86, 34), duration: 600 })
      .toPromise()
      .then(() => {});

    this.pdownSub = this.on("pointerdown", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.pupSub = this.on("pointerup", (evt: PointerEvent) => {
      evt.cancel();
    });
    this.pmoveSub = this.on("pointermove", (evt: PointerEvent) => {
      //   evt.cancel();
    });
    this.penterSub = this.on("pointerenter", (evt: PointerEvent) => {
      console.log("child hover");
      this._isHovered = true;
      evt.cancel();
    });
    this.pexitSub = this.on("pointerleave", (evt: PointerEvent) => {
      this._isHovered = false;
      evt.cancel();
    });
  }

  onRemove(en: Engine): void {
    super.onRemove(en);
    this.pdownSub?.close();
    this.pupSub?.close();
    this.pmoveSub?.close();
    this.penterSub?.close();
    this.pexitSub?.close();
  }

  onPreUpdate(eng: Engine, delta: number): void {
    this.isHeaderHovered = this.header.isHovered;

    if (!this.isHeaderHovered && !this._isHovered) {
      this.closeTimer += delta;
    } else {
      this.closeTimer = 0;
    }

    if (this.closeTimer > this.closeLimit) {
      this.closeTimer = 0;
      this.actions
        .moveTo({ pos: vec(86, -200), duration: 600 })
        .toPromise()
        .then(() => {
          this.kill();
        });
    }
  }
}
