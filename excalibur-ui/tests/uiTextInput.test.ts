import { describe, it, expect, vi, beforeEach } from "vitest";
import { UITextInput } from "../Components/uiTextInput"; // adjust path
import { Keys, vec } from "excalibur";

/* ------------------ MOCKS ------------------ */

// Minimal canvas mock
HTMLCanvasElement.prototype.getContext = vi.fn(() => {
  return {
    clearRect: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    roundRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    measureText: vi.fn(() => ({ width: 10 })),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    set filter(_) {},
    set fillStyle(_) {},
    set strokeStyle(_) {},
    set lineWidth(_) {},
    font: "",
  } as any;
});

// mock canvas-txt
vi.mock("canvas-txt", () => ({
  drawText: vi.fn(),
}));

// mock excalibur pieces
vi.mock("excalibur", async () => {
  return {
    ScreenElement: class {
      name = "test";
      pos = { x: 0, y: 0 };
      graphics = {
        use: vi.fn(),
        localBounds: { left: 0, right: 200, top: 0, bottom: 40 },
      };
      pointer = { useGraphicsBounds: false };
      on = vi.fn();
      off = vi.fn();
      emit = vi.fn();
      onPreUpdate() {}
    },
    EventEmitter: class {
      emit = vi.fn();
    },
    Keys: {
      Backspace: "Backspace",
      Delete: "Delete",
      Left: "Left",
      Right: "Right",
      Home: "Home",
      End: "End",
      Enter: "Enter",
    },
    Color: { fromHex: () => ({ toString: () => "#000" }) },
    Graphic: class {},
    GameEvent: class {},
    Font: class {},
    vec: (x: number, y: number) => ({ x, y }),
  };
});

/* ------------------ HELPERS ------------------ */

function keyEvt(key: string, value = key) {
  return { key, value } as any;
}

/* ------------------ TESTS ------------------ */

describe("UITextInput", () => {
  let input: UITextInput;

  beforeEach(() => {
    input = new UITextInput({ name: "input", pos: vec(0, 0), width: 200, height: 40 });
  });

  it("initializes with empty value", () => {
    expect(input.getValue()).toBe("");
    expect(input.getCursorPosition()).toBe(0);
  });

  it("sets focus and emits focused event", () => {
    const spy = vi.spyOn(input.eventEmitter, "emit");
    input.focus();

    expect(input.inputState).toBe("focused");
    expect(spy).toHaveBeenCalledWith("UITextInputFocused", expect.anything());
  });

  it("removes focus and emits blurred event", () => {
    const spy = vi.spyOn(input.eventEmitter, "emit");
    input.focus();
    input.loseFocus();

    expect(input.inputState).toBe("normal");
    expect(spy).toHaveBeenCalledWith("UITextInputUnfocused", expect.anything());
  });

  it("types characters when focused", () => {
    input.focus();
    input.onKeyDown(keyEvt("a", "a"));
    input.onKeyDown(keyEvt("b", "b"));

    expect(input.getValue()).toBe("ab");
    expect(input.getCursorPosition()).toBe(2);
  });

  it("ignores typing when not focused", () => {
    input.onKeyDown(keyEvt("a", "a"));
    expect(input.getValue()).toBe("");
  });

  it("handles backspace", () => {
    input.focus();
    input.setValue("abc");
    input.setCursorPosition(3);

    input.onKeyDown(keyEvt(Keys.Backspace));
    expect(input.getValue()).toBe("ab");
  });

  it("handles delete", () => {
    input.focus();
    input.setValue("abc");
    input.setCursorPosition(1);

    input.onKeyDown(keyEvt(Keys.Delete));
    expect(input.getValue()).toBe("ac");
  });

  it("moves cursor left and right", () => {
    input.focus();
    input.setValue("abc");
    input.setCursorPosition(2);

    input.onKeyDown(keyEvt(Keys.Left));
    expect(input.getCursorPosition()).toBe(1);

    input.onKeyDown(keyEvt(Keys.Right));
    expect(input.getCursorPosition()).toBe(2);
  });

  it("handles home/end", () => {
    input.focus();
    input.setValue("abc");

    input.onKeyDown(keyEvt(Keys.Home));
    expect(input.getCursorPosition()).toBe(0);

    input.onKeyDown(keyEvt(Keys.End));
    expect(input.getCursorPosition()).toBe(3);
  });

  it("respects maxLength", () => {
    input = new UITextInput({
      name: "input",
      pos: vec(0, 0),
      width: 200,
      height: 40,
      maxLength: 2,
    });

    input.focus();
    input.onKeyDown(keyEvt("a", "a"));
    input.onKeyDown(keyEvt("b", "b"));
    input.onKeyDown(keyEvt("c", "c"));

    expect(input.getValue()).toBe("ab");
  });

  it("emits submit event on Enter", () => {
    const spy = vi.spyOn(input.eventEmitter, "emit");
    input.focus();
    input.setValue("hello");

    input.onKeyDown(keyEvt(Keys.Enter));

    expect(spy).toHaveBeenCalledWith(
      "UITextInputSubmit",
      expect.objectContaining({
        value: "hello",
      }),
    );
  });

  it("disables and clears focus", () => {
    const spy = vi.spyOn(input.eventEmitter, "emit");
    input.focus();
    input.setEnabled(false);

    expect(input.inputState).toBe("disabled");
    expect(spy).toHaveBeenCalledWith("UITextInputDisabled", expect.anything());
  });

  it("clamps cursor position", () => {
    input.setValue("abc");
    input.setCursorPosition(99);

    expect(input.getCursorPosition()).toBe(3);

    input.setCursorPosition(-5);
    expect(input.getCursorPosition()).toBe(0);
  });

  it("emits value changed when setValue differs", () => {
    const spy = vi.spyOn(input.eventEmitter, "emit");
    input.setValue("test");

    expect(spy).toHaveBeenCalledWith(
      "UITextInputValueChanged",
      expect.objectContaining({
        value: "test",
      }),
    );
  });
});
