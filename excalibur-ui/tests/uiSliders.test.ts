import { describe, it, expect, vi, beforeEach } from "vitest";
import { vec, Keys } from "excalibur";
import { UISlider, UISpriteSlider } from "../Components/uiSlider";

/**
 * Minimal fake engine + keyboard emitter
 */
function makeEngine() {
  return {
    input: {
      keyboard: {
        on: vi.fn(),
        off: vi.fn(),
      },
    },
  } as any;
}

function makePointerEvent(x: number, y: number) {
  return {
    worldPos: vec(x, y),
  } as any;
}

function makeKeyEvent(key: Keys) {
  return { key } as any;
}

describe("UISlider", () => {
  let slider: UISlider;

  beforeEach(() => {
    slider = new UISlider({
      name: "TestSlider",
      z: 1,
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      width: 100,
      height: 20,
      pos: vec(0, 0),
    });
  });

  it("initializes with correct value", () => {
    expect(slider.value).toBe(50);
    expect(slider.percent).toBe(0.5);
  });

  it("clamps and steps value", () => {
    slider.value = 73;
    expect(slider.value).toBe(70);

    slider.value = 999;
    expect(slider.value).toBe(100);

    slider.value = -50;
    expect(slider.value).toBe(0);
  });

  it("emits UISliderChanged when value changes", () => {
    const spy = vi.fn();
    slider.emitter.on("UISliderChanged", spy);

    slider.value = 60;

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      name: "TestSlider",
      event: "changed",
      value: 60,
      target: slider,
      percent: 0.6,
    });
  });

  it("does not emit if value does not change", () => {
    const spy = vi.fn();
    slider.emitter.on("UISliderChanged", spy);

    slider.value = 50; // same as initial

    expect(spy).not.toHaveBeenCalled();
  });

  it("updates value from horizontal pointer position", () => {
    (slider as any).onPointerDown(makePointerEvent(25, 0));
    expect(slider.value).toBe(30); // 25% of 100 = 25 → stepped to 30
  });

  it("updates value from vertical pointer position", () => {
    const vertical = new UISlider({
      orientation: "vertical",
      min: 0,
      max: 100,
      step: 10,
      value: 0,
      width: 20,
      height: 100,
      pos: vec(0, 0),
    });

    // y=75 => 1 - (75/100) = 0.25 → 25
    (vertical as any).onPointerDown(makePointerEvent(0, 75));
    expect(vertical.value).toBe(30);
  });

  it("responds to keyboard when focused", () => {
    slider.focus();

    (slider as any).onKeyDown(makeKeyEvent(Keys.Right));
    expect(slider.value).toBe(60);

    (slider as any).onKeyDown(makeKeyEvent(Keys.Left));
    expect(slider.value).toBe(50);
  });

  it("ignores keyboard when not focused", () => {
    (slider as any).onKeyDown(makeKeyEvent(Keys.Right));
    expect(slider.value).toBe(50);
  });

  it("disables dragging when disabled", () => {
    slider.setEnabled(false);

    (slider as any).onPointerDown(makePointerEvent(80, 0));
    expect(slider.value).toBe(50);
  });

  it("toggles focus correctly", () => {
    slider.focus();
    expect(slider.isFocused).toBe(true);

    slider.loseFocus();
    expect(slider.isFocused).toBe(false);
  });
});

describe("UISpriteSlider", () => {
  let slider: UISpriteSlider;

  const fakeSprite = {
    width: 10,
    height: 10,
    image: { image: document.createElement("canvas") },
  } as any;

  beforeEach(() => {
    slider = new UISpriteSlider({
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      width: 100,
      height: 20,
      pos: vec(0, 0),
      sprites: {
        knob: fakeSprite,
        track: fakeSprite,
        fill: fakeSprite,
        border: fakeSprite,
      },
    });
  });

  it("initializes correctly", () => {
    expect(slider.value).toBe(50);
    expect(slider.percent).toBe(0.5);
  });

  it("steps and clamps value", () => {
    slider.value = 77;
    expect(slider.value).toBe(80);

    slider.value = -20;
    expect(slider.value).toBe(0);
  });

  it("updates value from pointer", () => {
    (slider as any).onPointerDown(makePointerEvent(50, 0));
    expect(slider.value).toBe(50);
  });

  it("responds to keyboard when focused", () => {
    slider.focus();
    (slider as any).onKeyDown(makeKeyEvent(Keys.Up));
    expect(slider.value).toBe(60);
  });

  it("does not respond to keyboard when unfocused", () => {
    (slider as any).onKeyDown(makeKeyEvent(Keys.Up));
    expect(slider.value).toBe(50);
  });

  it("emits UISliderChanged event", () => {
    const spy = vi.fn();
    slider.emitter.on("UISliderChanged", spy);

    slider.value = 60;

    expect(spy).toHaveBeenCalledOnce();
  });

  it("disables interaction when disabled", () => {
    slider.setEnabled(false);

    (slider as any).onPointerDown(makePointerEvent(80, 0));
    expect(slider.value).toBe(50);
  });
});
