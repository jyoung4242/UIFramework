import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  UIPanel,
  UISpritePanel,
  UINineSlicePanel,
  UIPanelShown,
  UIPanelHidden,
  type UIPanelConfig,
  type UISpritePanelConfig,
  type UINineSlicePanelConfig,
} from "../Components";
import { Engine, Color, vec, Sprite, ImageSource, NineSliceStretch, Scene } from "excalibur";

let engine: Engine;
let scene: Scene;

describe("UIPanel", () => {
  let mockEngine: Engine;

  beforeEach(() => {
    engine = new Engine({ width: 800, height: 600, suppressConsoleBootMessage: true });
    scene = engine.currentScene;
  });

  describe("constructor", () => {
    it("should create a UIPanel with default config", () => {
      const panel = new UIPanel({});

      expect(panel).toBeDefined();
      expect(panel.name).toBe("UIPanel");
      expect(panel.width).toBe(200);
      expect(panel.height).toBe(150);
    });

    it("should create a UIPanel with custom config", () => {
      const config: Partial<UIPanelConfig> = {
        name: "TestPanel",
        width: 300,
        height: 200,
        pos: vec(50, 50),
        z: 10,
        borderWidth: 4,
        panelRadius: 20,
      };

      const panel = new UIPanel(config);

      expect(panel.name).toBe("TestPanel");
      expect(panel.width).toBe(300);
      expect(panel.height).toBe(200);
      expect(panel.pos.x).toBe(50);
      expect(panel.pos.y).toBe(50);
      expect(panel.z).toBe(10);
    });

    it("should accept custom colors", () => {
      const config: Partial<UIPanelConfig> = {
        colors: {
          backgroundStarting: Color.Red,
          backgroundEnding: Color.Blue,
          borderColor: Color.Green,
        },
      };

      const panel = new UIPanel(config);
      expect(panel).toBeDefined();
    });

    it("should accept shadow configuration", () => {
      const config: Partial<UIPanelConfig> = {
        shadow: {
          offsetX: 5,
          offsetY: 5,
          blur: 10,
          color: Color.Black,
        },
      };

      const panel = new UIPanel(config);
      expect(panel).toBeDefined();
    });
  });

  describe("visibility", () => {
    it("should be visible by default", () => {
      const panel = new UIPanel({});
      expect(panel.isVisible).toBe(true);
    });

    it("should respect initial visibility config", () => {
      const panel = new UIPanel({ visible: false });
      expect(panel.isVisible).toBe(false);
    });

    it("should hide the panel when hide() is called", () => {
      const panel = new UIPanel({});
      panel.hide();

      expect(panel.isVisible).toBe(false);
      expect(panel.graphics.visible).toBe(false);
    });

    it("should show the panel when show() is called", () => {
      const panel = new UIPanel({ visible: false });
      panel.show();

      expect(panel.isVisible).toBe(true);
      expect(panel.graphics.visible).toBe(true);
    });

    it("should toggle visibility", () => {
      const panel = new UIPanel({});

      panel.toggle();
      expect(panel.isVisible).toBe(false);

      panel.toggle();
      expect(panel.isVisible).toBe(true);
    });

    it("should not emit events when visibility does not change", () => {
      const panel = new UIPanel({});
      const showSpy = vi.fn();
      const hideSpy = vi.fn();

      panel.eventEmitter.on("UIPanelShown", showSpy);
      panel.eventEmitter.on("UIPanelHidden", hideSpy);

      panel.show(); // Already visible
      panel.show(); // Already visible

      expect(showSpy).not.toHaveBeenCalled();
    });
  });

  describe("events", () => {
    it("should emit UIPanelShown event when shown", () => {
      const panel = new UIPanel({ visible: false });
      const spy = vi.fn();

      panel.eventEmitter.on("UIPanelShown", spy);
      panel.show();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: panel.name,
          target: panel,
          event: "shown",
        }),
      );
    });

    it("should emit UIPanelHidden event when hidden", () => {
      const panel = new UIPanel({});
      const spy = vi.fn();

      panel.eventEmitter.on("UIPanelHidden", spy);
      panel.hide();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: panel.name,
          target: panel,
          event: "hidden",
        }),
      );
    });
  });

  describe("contentArea", () => {
    it("should return correct content area with default padding", () => {
      const panel = new UIPanel({
        width: 200,
        height: 150,
      });

      const contentArea = panel.contentArea;

      expect(contentArea).toEqual({
        x: 10,
        y: 10,
        width: 180,
        height: 130,
      });
    });

    it("should return correct content area with custom padding", () => {
      const panel = new UIPanel({
        width: 200,
        height: 150,
        padding: vec(20, 30),
      });

      const contentArea = panel.contentArea;

      expect(contentArea).toEqual({
        x: 20,
        y: 30,
        width: 160,
        height: 90,
      });
    });
  });

  describe("lifecycle", () => {
    it("should handle onAdd when visible", () => {
      const panel = new UIPanel({});
      panel.onAdd(mockEngine);

      expect(panel.graphics.visible).toBe(true);
    });

    it("should handle onAdd when not visible", () => {
      const panel = new UIPanel({ visible: false });
      panel.onAdd(mockEngine);

      expect(panel.graphics.visible).toBe(false);
    });

    it("should handle onRemove", () => {
      const panel = new UIPanel({});
      expect(() => panel.onRemove(mockEngine)).not.toThrow();
    });
  });
});

describe("UISpritePanel", () => {
  let mockEngine: Engine;
  let mockSprite: Sprite;

  beforeEach(() => {
    mockEngine = {
      canvas: document.createElement("canvas"),
    } as Engine;

    const mockImage = new ImageSource("test.png");
    mockSprite = new Sprite({
      image: mockImage,
      sourceView: { x: 0, y: 0, width: 100, height: 100 },
    });
  });

  describe("constructor", () => {
    it("should create a UISpritePanel with default config", () => {
      const panel = new UISpritePanel({});

      expect(panel).toBeDefined();
      expect(panel.name).toBe("UISpritePanel");
    });

    it("should create a UISpritePanel with sprite", () => {
      const panel = new UISpritePanel({
        sprite: mockSprite,
        width: 150,
        height: 100,
      });

      expect(panel).toBeDefined();
      expect(panel.width).toBe(150);
      expect(panel.height).toBe(100);
    });
  });

  describe("visibility", () => {
    it("should toggle visibility", () => {
      const panel = new UISpritePanel({});

      panel.toggle();
      expect(panel.isVisible).toBe(false);

      panel.toggle();
      expect(panel.isVisible).toBe(true);
    });
  });

  describe("events", () => {
    it("should emit events on show/hide", () => {
      const panel = new UISpritePanel({ visible: false });
      const showSpy = vi.fn();
      const hideSpy = vi.fn();

      panel.eventEmitter.on("UIPanelShown", showSpy);
      panel.eventEmitter.on("UIPanelHidden", hideSpy);

      panel.show();
      expect(showSpy).toHaveBeenCalledTimes(1);

      panel.hide();
      expect(hideSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("contentArea", () => {
    it("should calculate content area correctly", () => {
      const panel = new UISpritePanel({
        width: 300,
        height: 200,
        padding: vec(15, 15),
      });

      const contentArea = panel.contentArea;

      expect(contentArea).toEqual({
        x: 15,
        y: 15,
        width: 270,
        height: 170,
      });
    });
  });
});

describe("UINineSlicePanel", () => {
  let mockEngine: Engine;
  let mockSprite: Sprite;

  beforeEach(() => {
    mockEngine = {
      canvas: document.createElement("canvas"),
    } as Engine;

    const mockImage = new ImageSource("test.png");
    mockSprite = new Sprite({
      image: mockImage,
      sourceView: { x: 0, y: 0, width: 100, height: 100 },
    });
  });

  describe("constructor", () => {
    it("should create a UINineSlicePanel with required config", () => {
      const panelConfig: UINineSlicePanelConfig = {
        name: "UINineSlicePanel",
        width: 200,
        height: 150,
        pos: vec(0, 0),
        sprite: mockSprite,
        destinationConfig: {
          stretchH: NineSliceStretch.Stretch,
          stretchV: NineSliceStretch.Stretch,
          drawCenter: true,
        },
        sourceConfig: {
          width: 100,
          height: 100,
          topMargin: 10,
          leftMargin: 10,
          bottomMargin: 10,
          rightMargin: 10,
        },
      };

      const panel = new UINineSlicePanel(panelConfig);

      expect(panel).toBeDefined();
      expect(panel.name).toBe("UINineSlicePanel");
    });

    it("should accept custom dimensions and position", () => {
      const panelConfig: UINineSlicePanelConfig = {
        name: "CustomNineSlice",
        width: 400,
        height: 300,
        pos: vec(0, 0),
        sprite: mockSprite,
        destinationConfig: {
          stretchH: NineSliceStretch.Stretch,
          stretchV: NineSliceStretch.Stretch,
          drawCenter: true,
        },
        sourceConfig: {
          width: 100,
          height: 100,
          topMargin: 10,
          leftMargin: 10,
          bottomMargin: 10,
          rightMargin: 10,
        },
      };
      const panel = new UINineSlicePanel(panelConfig);

      expect(panel.name).toBe("CustomNineSlice");
      expect(panel.width).toBe(400);
      expect(panel.height).toBe(300);
    });

    it("should accept destination config", () => {
      const panel = new UINineSlicePanel({
        sprite: mockSprite,
        sourceConfig: {
          width: 100,
          height: 100,
          topMargin: 10,
          leftMargin: 10,
          bottomMargin: 10,
          rightMargin: 10,
        },
        destinationConfig: {
          drawCenter: false,
          stretchH: NineSliceStretch.Tile,
          stretchV: NineSliceStretch.Stretch,
        },
      });

      expect(panel).toBeDefined();
    });
  });

  describe("visibility", () => {
    it("should handle visibility changes", () => {
      const panel = new UINineSlicePanel({
        sprite: mockSprite,
        sourceConfig: {
          width: 100,
          height: 100,
          topMargin: 10,
          leftMargin: 10,
          bottomMargin: 10,
          rightMargin: 10,
        },
      });

      expect(panel.isVisible).toBe(true);

      panel.hide();
      expect(panel.isVisible).toBe(false);

      panel.show();
      expect(panel.isVisible).toBe(true);
    });
  });

  describe("contentArea", () => {
    it("should calculate content area correctly", () => {
      const panel = new UINineSlicePanel({
        sprite: mockSprite,
        width: 500,
        height: 400,
        padding: vec(25, 25),
        sourceConfig: {
          width: 100,
          height: 100,
          topMargin: 10,
          leftMargin: 10,
          bottomMargin: 10,
          rightMargin: 10,
        },
      });

      const contentArea = panel.contentArea;

      expect(contentArea).toEqual({
        x: 25,
        y: 25,
        width: 450,
        height: 350,
      });
    });
  });
});

describe("Event Classes", () => {
  it("should create UIPanelShown event", () => {
    const panel = new UIPanel({});
    const event = new UIPanelShown(panel);

    expect(event.target).toBe(panel);
  });

  it("should create UIPanelHidden event", () => {
    const panel = new UIPanel({});
    const event = new UIPanelHidden(panel);

    expect(event.target).toBe(panel);
  });
});
