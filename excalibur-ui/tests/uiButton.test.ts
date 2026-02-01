import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  Buttons,
  Engine,
  GlobalCoordinates,
  KeyEvent,
  Keys,
  PointerButton,
  PointerEvent,
  PointerType,
  Scene,
  ScreenElement,
  Vector,
} from "excalibur";
import { UIButton } from "../Components/uiButton";

let engine: Engine;
let scene: Scene;
let button: UIButton;

function createButton() {
  return new UIButton({
    name: "Test",
    idleText: "Test",
    width: 100,
    height: 40,
    pos: new Vector(0, 0),
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("UIButton", () => {
  beforeEach(() => {
    engine = new Engine({ width: 800, height: 600, suppressConsoleBootMessage: true });
    scene = engine.currentScene;
    button = createButton();
    scene.add(button);
  });

  // -----------------------------
  // BASIC CONSTRUCTION
  // -----------------------------

  it("should be a ScreenElement", () => {
    expect(button).toBeDefined();
    expect(button).toBeInstanceOf(ScreenElement);
  });

  it("should default to idle state", () => {
    expect(button.buttonState).toBe("idle");
  });

  it("should not be disabled by default", () => {
    expect(button.buttonState === "disabled").toBe(false);
  });

  // -----------------------------
  // ENABLE / DISABLE
  // -----------------------------

  it("should transition to disabled state", () => {
    button.setEnabled(false);
    expect(button.isEnabled).toBe(false);
  });

  it("should emit disable event", () => {
    const spy = vi.fn();
    const emitter = button.eventEmitter;
    emitter.on("UIButtonDisabled", spy);

    button.setEnabled(false);
    expect(spy).toHaveBeenCalled();
  });

  it("should not respond to input when disabled", () => {
    button.setEnabled(false);

    // simulate pointer down/up
    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );
    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(button.buttonState).toBe("disabled");
  });

  it("should emit enable event when re-enabled", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonEnabled", spy);

    button.setEnabled(false);
    button.setEnabled(true);

    expect(spy).toHaveBeenCalled();
  });

  // -----------------------------
  // POINTER INTERACTION
  // -----------------------------

  it("should enter hovered state on pointer enter", () => {
    button.onHover();
    expect(button.buttonState).toBe("hovered");
  });

  it("should return to idle on pointer leave", () => {
    button.onHover();
    button.onUnhover();
    expect(button.buttonState).toBe("idle");
  });

  it("should enter pressed state on pointer down", () => {
    button.onHover();
    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );
    expect(button.buttonState).toBe("pressed");
  });

  it("should emit click on press and release inside bounds", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonClicked", spy);

    button.onHover();
    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );
    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(spy).toHaveBeenCalled();
  });

  it("should not emit click if released outside bounds", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonClicked", spy);

    button.onHover();
    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );

    button.onUnhover();
    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it("should emit up event on pointer up", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonUp", spy);

    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );

    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(spy).toHaveBeenCalled();
  });

  // -----------------------------
  // KEYBOARD FOCUS
  // -----------------------------

  it("should be focusable via keyboard", () => {
    button.focus();
    expect(button.isFocused).toBe(true);
  });

  it("should emit focus event", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonFocused", spy);
    button.focus();
    expect(spy).toHaveBeenCalled();
  });

  it("should not be focusable when disabled", () => {
    button.setEnabled(false);
    button.focus();
    expect(button.isFocused).toBe(false);
  });

  // -----------------------------
  // KEYBOARD ACTIVATION
  // -----------------------------

  it("should click when Enter is pressed while focused", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonClicked", spy);
    button.focus();
    button.onKeyDown(new KeyEvent(Keys.Enter, "Enter"));
    button.onKeyUp(new KeyEvent(Keys.Enter, "Enter"));
    expect(spy).toHaveBeenCalled();
  });

  it("should click when Space is pressed while focused", () => {
    const spy = vi.fn();
    let emitter = button.eventEmitter;
    emitter.on("UIButtonClicked", spy);

    button.focus();
    button.onKeyDown(new KeyEvent(Keys.Space, " "));
    button.onKeyUp(new KeyEvent(Keys.Space, " "));

    expect(spy).toHaveBeenCalled();
  });

  // -----------------------------
  // EDGE CASES
  // -----------------------------

  it("should not hover when disabled", () => {
    button.setEnabled(false);
    button.onHover();

    expect(button.buttonState).toBe("disabled");
  });

  it("should not fire click if pointer down starts outside", () => {
    const spy = vi.fn();
    button.on("click", spy);
    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it("should clean up listeners on kill", () => {
    const spy = vi.fn();
    button.on("click", spy);

    button.kill();
    button.onPointerDown(
      new PointerEvent(
        "down",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerdown"),
      ),
    );
    button.onClick(
      new PointerEvent(
        "up",
        0,
        PointerButton.Left,
        PointerType.Mouse,
        new GlobalCoordinates(new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)),
        new Event("pointerup"),
      ),
    );

    expect(spy).not.toHaveBeenCalled();
  });
});
