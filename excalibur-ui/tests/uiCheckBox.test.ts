import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  UICheckbox,
  UISpriteCheckbox,
  UICheckboxChanged,
  UICheckboxFocused,
  UICheckboxUnfocused,
  UICheckboxEnabled,
  UICheckboxDisabled,
  UICheckboxDown,
  UICheckboxUp,
} from "../Components/uiCheckbox";
import { Engine, Color, vec, Keys, Sprite, ImageSource } from "excalibur";

// Mock canvas and context
const mockContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  fillRect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  roundRect: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  set fillStyle(v: any) {},
  set strokeStyle(v: any) {},
  set lineWidth(v: any) {},
  set lineCap(v: any) {},
  set lineJoin(v: any) {},
  set filter(v: any) {},
  set globalCompositeOperation(v: any) {},
};

describe("UICheckbox", () => {
  let engine: Engine;
  let checkbox: UICheckbox;

  beforeEach(() => {
    // Create a mock engine
    engine = {
      input: {
        keyboard: {
          on: vi.fn(),
          off: vi.fn(),
        },
      },
    } as any;

    checkbox = new UICheckbox({
      name: "TestCheckbox",
      width: 24,
      height: 24,
      pos: vec(100, 100),
      checked: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should create a checkbox with default values", () => {
      const cb = new UICheckbox({
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
      });
      expect(cb.name).toBe("UICheckbox");
      expect(cb.checked).toBe(false);
      expect(cb.width).toBe(24);
      expect(cb.height).toBe(24);
    });

    it("should create a checkbox with custom config", () => {
      const cb = new UICheckbox({
        name: "CustomCheckbox",
        width: 32,
        height: 32,
        pos: vec(50, 50),
        checked: true,
        borderRadius: 8,
      });
      expect(cb.name).toBe("CustomCheckbox");
      expect(cb.checked).toBe(true);
      expect(cb.width).toBe(32);
      expect(cb.height).toBe(32);
    });

    it("should initialize with checked state", () => {
      const cb = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: true });
      expect(cb.checked).toBe(true);
    });

    it("should initialize with unchecked state", () => {
      const cb = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      expect(cb.checked).toBe(false);
    });
  });

  describe("Checked State", () => {
    it("should get checked state", () => {
      expect(checkbox.checked).toBe(false);
    });

    it("should set checked state", () => {
      checkbox.checked = true;
      expect(checkbox.checked).toBe(true);
    });

    it("should toggle from unchecked to checked", () => {
      checkbox.toggle();
      expect(checkbox.checked).toBe(true);
    });

    it("should toggle from checked to unchecked", () => {
      checkbox.checked = true;
      checkbox.toggle();
      expect(checkbox.checked).toBe(false);
    });

    it("should emit UICheckboxChanged event when checked state changes", () => {
      const handler = vi.fn();
      checkbox.emitter.on("UICheckboxChanged", handler);

      checkbox.checked = true;

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        checked: true,
        name: "TestCheckbox",
        target: checkbox,
      });
    });

    it("should not emit event when setting same checked value", () => {
      const handler = vi.fn();
      checkbox.emitter.on("UICheckboxChanged", handler);

      checkbox.checked = false;

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("Focus", () => {
    it("should not be focused by default", () => {
      expect(checkbox.isFocused).toBe(false);
    });

    it("should set focus", () => {
      checkbox.focus();
      expect(checkbox.isFocused).toBe(true);
    });

    it("should lose focus", () => {
      checkbox.focus();
      checkbox.loseFocus();
      expect(checkbox.isFocused).toBe(false);
    });
  });

  describe("Enabled State", () => {
    it("should be enabled by default", () => {
      expect(checkbox.isEnabled).toBe(true);
    });

    it("should set enabled state", () => {
      checkbox.setEnabled(false);
      expect(checkbox.isEnabled).toBe(false);
    });

    it("should enable checkbox", () => {
      checkbox.setEnabled(false);
      checkbox.setEnabled(true);
      expect(checkbox.isEnabled).toBe(true);
    });
  });

  describe("Event Handlers", () => {
    it("should register event handlers on add", () => {
      checkbox.onAdd(engine);
      expect(engine.input.keyboard.on).toHaveBeenCalledWith("press", expect.any(Function));
    });

    it("should unregister event handlers on remove", () => {
      checkbox.onAdd(engine);
      checkbox.onRemove(engine);
      expect(engine.input.keyboard.off).toHaveBeenCalledWith("press", expect.any(Function));
    });
  });

  describe("Pointer Interaction", () => {
    it("should toggle on pointer up", () => {
      const initialState = checkbox.checked;
      const pointerEvent = {} as any;

      checkbox.onAdd(engine);
      checkbox.emit("pointerup", pointerEvent);

      expect(checkbox.checked).toBe(!initialState);
    });

    it("should not toggle on pointer up when disabled", () => {
      checkbox.setEnabled(false);
      const initialState = checkbox.checked;
      const pointerEvent = {} as any;

      checkbox.onAdd(engine);
      checkbox.emit("pointerup", pointerEvent);

      expect(checkbox.checked).toBe(initialState);
    });
  });

  describe("Keyboard Interaction", () => {
    it("should toggle on Space key when focused", () => {
      checkbox.focus();
      const initialState = checkbox.checked;

      checkbox.onAdd(engine);
      // Get the keyboard handler that was registered
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.Space });

      expect(checkbox.checked).toBe(!initialState);
    });

    it("should toggle on Enter key when focused", () => {
      checkbox.focus();
      const initialState = checkbox.checked;

      checkbox.onAdd(engine);
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.Enter });

      expect(checkbox.checked).toBe(!initialState);
    });

    it("should not toggle when not focused", () => {
      const initialState = checkbox.checked;

      checkbox.onAdd(engine);
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.Space });

      expect(checkbox.checked).toBe(initialState);
    });

    it("should not toggle on other keys", () => {
      checkbox.focus();
      const initialState = checkbox.checked;

      checkbox.onAdd(engine);
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.A });

      expect(checkbox.checked).toBe(initialState);
    });
  });

  describe("Configuration Options", () => {
    it("should support custom border radius", () => {
      const cb = new UICheckbox({
        borderRadius: 8,
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
      });
      expect(cb).toBeDefined();
    });

    it("should support custom checkmark style", () => {
      const cb = new UICheckbox({
        checkmarkStyle: "x",
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
      });
      expect(cb).toBeDefined();
    });

    it("should support custom colors", () => {
      const cb = new UICheckbox({
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
        colors: {
          border: Color.Red,
          background: Color.Blue,
          backgroundChecked: Color.Green,
          checkmark: Color.Yellow,
          disabled: Color.Gray,
        },
      });
      expect(cb).toBeDefined();
    });

    it("should support custom focus indicator position", () => {
      const cb = new UICheckbox({
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
        focusIndicator: vec(10, 10),
      });
      expect(cb).toBeDefined();
    });

    it("should support tab stop index", () => {
      const cb = new UICheckbox({
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
        tabStopIndex: 1,
      });
      expect(cb).toBeDefined();
    });
  });
});

describe("UISpriteCheckbox", () => {
  let engine: Engine;
  let spriteCheckbox: UISpriteCheckbox;
  let uncheckedSprite: Sprite;
  let checkedSprite: Sprite;

  beforeEach(() => {
    engine = {
      input: {
        keyboard: {
          on: vi.fn(),
          off: vi.fn(),
        },
      },
    } as any;

    // Create mock sprites
    const mockImage = {
      image: document.createElement("canvas"),
    } as any;

    uncheckedSprite = {
      image: mockImage,
    } as any;

    checkedSprite = {
      image: mockImage,
    } as any;

    spriteCheckbox = new UISpriteCheckbox({
      name: "TestSpriteCheckbox",
      width: 32,
      height: 32,
      pos: vec(100, 100),
      checked: false,
      sprites: {
        unchecked: uncheckedSprite,
        checked: checkedSprite,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should create a sprite checkbox with default values", () => {
      const cb = new UISpriteCheckbox({ name: "UISpriteCheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      expect(cb.name).toBe("UISpriteCheckbox");
      expect(cb.checked).toBe(false);
      expect(cb.width).toBe(24);
      expect(cb.height).toBe(24);
    });

    it("should create a sprite checkbox with custom sprites", () => {
      expect(spriteCheckbox.uncheckedSprite).toBe(uncheckedSprite);
      expect(spriteCheckbox.checkedSprite).toBe(checkedSprite);
    });

    it("should handle null sprites", () => {
      const cb = new UISpriteCheckbox({
        name: "UICheckbox",
        width: 24,
        height: 24,
        pos: vec(50, 50),
        checked: false,
        sprites: {
          unchecked: null,
          checked: null,
        },
      });
      expect(cb.uncheckedSprite).toBeNull();
      expect(cb.checkedSprite).toBeNull();
    });
  });

  describe("Checked State", () => {
    it("should get checked state", () => {
      expect(spriteCheckbox.checked).toBe(false);
    });

    it("should set checked state", () => {
      spriteCheckbox.checked = true;
      expect(spriteCheckbox.checked).toBe(true);
    });

    it("should toggle from unchecked to checked", () => {
      spriteCheckbox.toggle();
      expect(spriteCheckbox.checked).toBe(true);
    });

    it("should emit UICheckboxChanged event when checked state changes", () => {
      const handler = vi.fn();
      spriteCheckbox.emitter.on("UICheckboxChanged", handler);

      spriteCheckbox.checked = true;

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        checked: true,
        name: "TestSpriteCheckbox",
        target: spriteCheckbox,
      });
    });
  });

  describe("Focus", () => {
    it("should set focus", () => {
      spriteCheckbox.focus();
      expect(spriteCheckbox.isFocused).toBe(true);
    });

    it("should lose focus", () => {
      spriteCheckbox.focus();
      spriteCheckbox.loseFocus();
      expect(spriteCheckbox.isFocused).toBe(false);
    });
  });

  describe("Enabled State", () => {
    it("should be enabled by default", () => {
      expect(spriteCheckbox.isEnabled).toBe(true);
    });

    it("should set enabled state", () => {
      spriteCheckbox.setEnabled(false);
      expect(spriteCheckbox.isEnabled).toBe(false);
    });
  });

  describe("Pointer Interaction", () => {
    it("should toggle on pointer up", () => {
      const initialState = spriteCheckbox.checked;
      const pointerEvent = {} as any;

      spriteCheckbox.onAdd(engine);
      spriteCheckbox.emit("pointerup", pointerEvent);

      expect(spriteCheckbox.checked).toBe(!initialState);
    });

    it("should not toggle on pointer up when disabled", () => {
      spriteCheckbox.setEnabled(false);
      const initialState = spriteCheckbox.checked;
      const pointerEvent = {} as any;

      spriteCheckbox.onAdd(engine);
      spriteCheckbox.emit("pointerup", pointerEvent);

      expect(spriteCheckbox.checked).toBe(initialState);
    });
  });

  describe("Keyboard Interaction", () => {
    it("should toggle on Space key when focused", () => {
      spriteCheckbox.focus();
      const initialState = spriteCheckbox.checked;

      spriteCheckbox.onAdd(engine);
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.Space });

      expect(spriteCheckbox.checked).toBe(!initialState);
    });

    it("should toggle on Enter key when focused", () => {
      spriteCheckbox.focus();
      const initialState = spriteCheckbox.checked;

      spriteCheckbox.onAdd(engine);
      const keyboardHandler = (engine.input.keyboard.on as any).mock.calls[0][1];
      keyboardHandler({ key: Keys.Enter });

      expect(spriteCheckbox.checked).toBe(!initialState);
    });
  });
});

describe("Event Classes", () => {
  describe("UICheckboxChanged", () => {
    it("should create event with correct properties", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxChanged(checkbox, true);
      expect(event.target).toBe(checkbox);
      expect(event.checked).toBe(true);
    });
  });

  describe("UICheckboxFocused", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxFocused(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });

  describe("UICheckboxUnfocused", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxUnfocused(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });

  describe("UICheckboxEnabled", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxEnabled(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });

  describe("UICheckboxDisabled", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxDisabled(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });

  describe("UICheckboxDown", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxDown(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });

  describe("UICheckboxUp", () => {
    it("should create event with target", () => {
      const checkbox = new UICheckbox({ name: "UICheckbox", width: 24, height: 24, pos: vec(50, 50), checked: false });
      const event = new UICheckboxUp(checkbox);
      expect(event.target).toBe(checkbox);
    });
  });
});
