import { describe, it, expect, vi, beforeEach } from "vitest";
import { Engine, Keys, vec, Sprite } from "excalibur";
import { UISwitch, UISpriteSwitch } from "../Components/uiSwitch"; // adjust path

function mockEngine() {
  return {
    input: {
      keyboard: {
        on: vi.fn(),
        off: vi.fn(),
      },
    },
  } as unknown as Engine;
}

function mockKeyEvent(key: Keys) {
  return { key } as any;
}

function mockPointerEvent() {
  return {} as any;
}

describe("UISwitch", () => {
  let engine: Engine;

  beforeEach(() => {
    engine = mockEngine();
  });

  it("initializes with default config", () => {
    const sw = new UISwitch({});

    expect(sw.checked).toBe(false);
    expect(sw.isEnabled).toBe(true);
    expect(sw.isFocused).toBe(false);
  });

  it("respects initial checked value", () => {
    const sw = new UISwitch({ checked: true });
    expect(sw.checked).toBe(true);
  });

  it("toggles when toggle() is called", () => {
    const sw = new UISwitch({ checked: false });
    sw.toggle();
    expect(sw.checked).toBe(true);
  });

  it("emits UISwitchChanged when checked changes", () => {
    const sw = new UISwitch({});
    const spy = vi.fn();

    sw.emitter.on("UISwitchChanged", spy);
    sw.checked = true;

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].checked).toBe(true);
  });

  it("does not emit when setting same value", () => {
    const sw = new UISwitch({ checked: false });
    const spy = vi.fn();

    sw.emitter.on("UISwitchChanged", spy);
    sw.checked = false;

    expect(spy).not.toHaveBeenCalled();
  });

  it("toggles on pointerup if enabled", () => {
    const sw = new UISwitch({});
    sw.onAdd(engine);

    // call private handler via event system
    (sw as any).onClick(mockPointerEvent());

    expect(sw.checked).toBe(true);
  });

  it("does not toggle on pointerup if disabled", () => {
    const sw = new UISwitch({});
    sw.setEnabled(false);

    (sw as any).onClick(mockPointerEvent());
    expect(sw.checked).toBe(false);
  });

  it("toggles on Space key when focused", () => {
    const sw = new UISwitch({});
    sw.focus();

    (sw as any).onKeyDown(mockKeyEvent(Keys.Space));
    expect(sw.checked).toBe(true);
  });

  it("toggles on Enter key when focused", () => {
    const sw = new UISwitch({});
    sw.focus();

    (sw as any).onKeyDown(mockKeyEvent(Keys.Enter));
    expect(sw.checked).toBe(true);
  });

  it("does not toggle on key press when not focused", () => {
    const sw = new UISwitch({});

    (sw as any).onKeyDown(mockKeyEvent(Keys.Space));
    expect(sw.checked).toBe(false);
  });

  it("focus() and loseFocus() update focused state", () => {
    const sw = new UISwitch({});
    sw.focus();
    expect(sw.isFocused).toBe(true);

    sw.loseFocus();
    expect(sw.isFocused).toBe(false);
  });

  it("registers keyboard listener on add and removes on remove", () => {
    const sw = new UISwitch({});

    sw.onAdd(engine);
    expect(engine.input.keyboard.on).toHaveBeenCalledWith("press", expect.any(Function));

    sw.onRemove(engine);
    expect(engine.input.keyboard.off).toHaveBeenCalledWith("press", expect.any(Function));
  });
});

describe("UISpriteSwitch", () => {
  it("initializes with sprites and default state", () => {
    const sw = new UISpriteSwitch({
      name: "customSwitch",
      width: 100,
      height: 50,
      pos: vec(100, 100),
      z: 1,
      checked: false,
      sprites: {
        trackOff: null,
        trackOn: null,
        knobOff: null,
        knobOn: null,
      },
    });

    expect(sw.checked).toBe(false);
    expect(sw.isEnabled).toBe(true);
  });

  it("toggles and emits event", () => {
    const sw = new UISpriteSwitch({
      name: "customSwitch",
      width: 100,
      height: 50,
      pos: vec(100, 100),
      z: 1,
      checked: true,
      sprites: {
        trackOff: null,
        trackOn: null,
        knobOff: null,
        knobOn: null,
      },
    });

    const spy2 = vi.fn();
    sw.emitter.on("UISwitchChanged", spy2);

    sw.toggle();
    expect(sw.checked).toBe(false);
    expect(spy2).toBeCalledTimes(2);
  });

  it("does not toggle when disabled", () => {
    const sw = new UISpriteSwitch({
      name: "customSwitch",
      width: 100,
      height: 50,
      pos: vec(100, 100),
      z: 1,
      checked: false,
      sprites: {
        trackOff: null,
        trackOn: null,
        knobOff: null,
        knobOn: null,
      },
    });

    sw.setEnabled(false);
    (sw as any).onClick({});

    expect(sw.checked).toBe(false);
  });

  it("responds to keyboard when focused", () => {
    const sw = new UISpriteSwitch({
      name: "customSwitch",
      width: 100,
      height: 50,
      pos: vec(100, 100),
      z: 1,
      checked: false,
      sprites: {
        trackOff: null,
        trackOn: null,
        knobOff: null,
        knobOn: null,
      },
    });

    sw.focus();
    (sw as any).onKeyDown({ key: Keys.Space });

    expect(sw.checked).toBe(true);
  });
});
