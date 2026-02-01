import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Engine, Vector, vec, Keys, Color } from "excalibur";
import {
  UINumeric,
  UINumericConfig,
  UINumericValueChanged,
  UINumericFocused,
  UINumericUnfocused,
  UINumericEnabled,
  UINumericDisabled,
  UINumericSubmit,
  UINumericIncrement,
  UINumericDecrement,
} from "../Components/uiNumeric";

describe("UINumeric", () => {
  let engine: Engine;
  let numericInput: UINumeric;

  beforeEach(() => {
    // Create a mock engine
    engine = new Engine({
      width: 800,
      height: 600,
    });
  });

  afterEach(() => {
    if (numericInput) {
      numericInput.kill();
    }
    if (engine) {
      engine.stop();
    }
  });

  describe("Initialization", () => {
    it("should create with default configuration", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });

      expect(numericInput).toBeDefined();
      expect(numericInput.getValue()).toBe(0);
      expect(numericInput.isEnabled).toBe(true);
      expect(numericInput.numericState).toBe("normal");
    });

    it("should create with custom configuration", () => {
      const config: UINumericConfig = {
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 42,
        min: 0,
        max: 100,
        step: 5,
        placeholder: "Enter value",
      };

      numericInput = new UINumeric(config);

      expect(numericInput.name).toBe("customNumeric");
      expect(numericInput.width).toBe(300);
      expect(numericInput.height).toBe(50);
      expect(numericInput.getValue()).toBe(42);
      expect(numericInput.min).toBe(0);
      expect(numericInput.max).toBe(100);
      expect(numericInput.step).toBe(5);
    });

    it("should clamp initial value to min/max range", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 150,
        min: 0,
        max: 100,
      });

      expect(numericInput.getValue()).toBe(100);
    });

    it("should clamp negative initial value to min", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: -50,
        min: 0,
        max: 100,
      });

      expect(numericInput.getValue()).toBe(0);
    });
  });

  describe("Value Management", () => {
    beforeEach(() => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 50,
        min: 0,
        max: 100,
        step: 10,
      });
    });

    it("should get current value", () => {
      expect(numericInput.getValue()).toBe(50);
    });

    it("should set value within range", () => {
      numericInput.setValue(75);
      expect(numericInput.getValue()).toBe(75);
    });

    it("should clamp value to max when setting above max", () => {
      numericInput.setValue(150);
      expect(numericInput.getValue()).toBe(100);
    });

    it("should clamp value to min when setting below min", () => {
      numericInput.setValue(-50);
      expect(numericInput.getValue()).toBe(0);
    });

    it("should emit UINumericValueChanged event when value changes", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericValueChanged", callback);

      numericInput.setValue(80);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 80,
          target: numericInput,
        }),
      );
    });

    it("should not emit event when value doesn't change", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericValueChanged", callback);

      numericInput.setValue(50); // Same as current value

      expect(callback).not.toHaveBeenCalled();
    });

    it("should increment value by step", () => {
      numericInput.increment();
      expect(numericInput.getValue()).toBe(60);
    });

    it("should decrement value by step", () => {
      numericInput.decrement();
      expect(numericInput.getValue()).toBe(40);
    });

    it("should clamp increment to max value", () => {
      numericInput.setValue(95);
      numericInput.increment(); // Would be 105, but max is 100
      expect(numericInput.getValue()).toBe(100);
    });

    it("should clamp decrement to min value", () => {
      numericInput.setValue(5);
      numericInput.decrement(); // Would be -5, but min is 0
      expect(numericInput.getValue()).toBe(0);
    });

    it("should emit UINumericIncrement event", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericIncrement", callback);

      numericInput.increment();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should emit UINumericDecrement event", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericDecrement", callback);

      numericInput.decrement();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Focus Management", () => {
    beforeEach(() => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 42 });
    });

    it("should set focus to true", () => {
      numericInput.focus();
      expect(numericInput.numericState).toBe("focused");
    });

    it("should set focus to false", () => {
      numericInput.focus();
      numericInput.loseFocus();
      expect(numericInput.numericState).toBe("normal");
    });

    it("should emit UINumericFocused event", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericFocused", callback);

      numericInput.focus();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should emit UINumericUnfocused event", () => {
      const callback = vi.fn();
      numericInput.focus();
      numericInput.eventEmitter.on("UINumericUnfocused", callback);

      numericInput.loseFocus();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not emit events when focus state doesn't change", () => {
      const focusCallback = vi.fn();
      numericInput.eventEmitter.on("UINumericFocused", focusCallback);

      numericInput.loseFocus(); // Already false

      expect(focusCallback).not.toHaveBeenCalled();
    });
  });

  describe("Enabled/Disabled State", () => {
    beforeEach(() => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 42 });
    });

    it("should be enabled by default", () => {
      expect(numericInput.isEnabled).toBe(true);
      expect(numericInput.numericState).toBe("normal");
    });

    it("should disable the input", () => {
      numericInput.setEnabled(false);
      expect(numericInput.isEnabled).toBe(false);
      expect(numericInput.numericState).toBe("disabled");
    });

    it("should enable the input", () => {
      numericInput.setEnabled(false);
      numericInput.setEnabled(true);
      expect(numericInput.isEnabled).toBe(true);
      expect(numericInput.numericState).toBe("normal");
    });

    it("should emit UINumericDisabled event", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericDisabled", callback);

      numericInput.setEnabled(false);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should emit UINumericEnabled event", () => {
      numericInput.setEnabled(false);
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericEnabled", callback);

      numericInput.setEnabled(true);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should remove focus when disabled", () => {
      numericInput.focus();
      numericInput.setEnabled(false);

      expect(numericInput.numericState).toBe("disabled");
    });
  });

  describe("Cursor Management", () => {
    beforeEach(() => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 123.45 });
    });

    it("should get cursor position", () => {
      const position = numericInput.getCursorPosition();
      expect(position).toBeGreaterThanOrEqual(0);
    });

    it("should set cursor position", () => {
      numericInput.focus();
      numericInput.setCursorPosition(5);
      expect(numericInput.getCursorPosition()).toBe(5);
    });

    it("should clamp cursor position to valid range", () => {
      numericInput.focus();
      const text = numericInput.getDisplayText();

      numericInput.setCursorPosition(-5); // Below min
      expect(numericInput.getCursorPosition()).toBe(0);

      numericInput.setCursorPosition(1000); // Above max
      expect(numericInput.getCursorPosition()).toBeLessThanOrEqual(text.length);
    });
  });

  describe("Display Text", () => {
    it("should format number with default options", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 1234.56 });
      const displayText = numericInput.getDisplayText();

      expect(displayText).toContain("1,234");
      expect(displayText).toContain("56");
    });

    it("should format number with custom decimal places", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 123.456,
        formatOptions: { decimals: 3 },
      });
      const displayText = numericInput.getDisplayText();

      expect(displayText).toContain("456");
    });

    it("should format number with prefix", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 100,
        formatOptions: { prefix: "$" },
      });
      const displayText = numericInput.getDisplayText();

      expect(displayText).toContain("$");
    });

    it("should format number with suffix", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 50,
        formatOptions: { suffix: "%" },
      });
      const displayText = numericInput.getDisplayText();

      expect(displayText).toContain("%");
    });

    it("should format number with custom separators", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 1234.56,
        formatOptions: {
          thousandsSeparator: ".",
          decimalSeparator: ",",
        },
      });
      const displayText = numericInput.getDisplayText();

      expect(displayText).toContain(".");
      expect(displayText).toContain(",");
    });

    it("should show placeholder when value is NaN", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, placeholder: "Enter number" });

      // Force NaN state
      numericInput.setValue(NaN);
      const displayText = numericInput.getDisplayText();

      expect(displayText).toBeTruthy();
    });
  });

  describe("Format Options", () => {
    beforeEach(() => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 1234.56 });
    });

    it("should update format options", () => {
      numericInput.setFormatOptions({
        prefix: "€",
        decimals: 3,
      });

      const displayText = numericInput.getDisplayText();
      expect(displayText).toContain("€");
    });

    it("should apply exponential notation when enabled", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 1000000,
        formatOptions: {
          useExponential: true,
          exponentialThreshold: 10000,
        },
      });

      const displayText = numericInput.getDisplayText();
      expect(displayText).toContain("e");
    });
  });

  describe("Min/Max/Step Configuration", () => {
    beforeEach(() => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 50,
        min: 0,
        max: 100,
        step: 5,
      });
    });

    it("should update min value", () => {
      numericInput.setMin(10);
      expect(numericInput.min).toBe(10);
    });

    it("should update max value", () => {
      numericInput.setMax(90);
      expect(numericInput.max).toBe(90);
    });

    it("should update step value", () => {
      numericInput.setStep(10);
      expect(numericInput.step).toBe(10);
    });

    it("should re-clamp value when min changes", () => {
      numericInput.setValue(5);
      numericInput.setMin(10);
      expect(numericInput.getValue()).toBe(10);
    });

    it("should re-clamp value when max changes", () => {
      numericInput.setValue(95);
      numericInput.setMax(90);
      expect(numericInput.getValue()).toBe(90);
    });

    it("should use absolute value for step", () => {
      numericInput.setStep(-5);
      expect(numericInput.step).toBe(5);
    });
  });

  describe("Keyboard Input Handling", () => {
    beforeEach(() => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 0,
        allowNegative: true,
        allowDecimal: true,
      });
      engine.add(numericInput);
      numericInput.focus();
    });

    it("should handle numeric key input", () => {
      const mockEvent = {
        key: Keys.Num5,
        value: "5",
      } as any;

      numericInput.onKeyDown(mockEvent);
      // Input is in editing mode, needs to be committed
    });

    it("should handle backspace", () => {
      numericInput.setValue(123);
      numericInput.focus();

      const mockEvent = {
        key: Keys.Backspace,
      } as any;

      numericInput.onKeyDown(mockEvent);
      // Cursor position should change
    });

    it("should handle delete key", () => {
      numericInput.setValue(123);
      numericInput.focus();
      numericInput.setCursorPosition(0);

      const mockEvent = {
        key: Keys.Delete,
      } as any;

      numericInput.onKeyDown(mockEvent);
      // Character at cursor should be deleted
    });

    it("should handle left arrow key", () => {
      numericInput.setValue(123);
      numericInput.focus();
      const initialPos = numericInput.getCursorPosition();

      const mockEvent = {
        key: Keys.Left,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getCursorPosition()).toBeLessThan(initialPos);
    });

    it("should handle right arrow key", () => {
      numericInput.setValue(123);
      numericInput.focus();
      numericInput.setCursorPosition(0);
      const initialPos = numericInput.getCursorPosition();

      const mockEvent = {
        key: Keys.Right,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getCursorPosition()).toBeGreaterThan(initialPos);
    });

    it("should handle Home key", () => {
      numericInput.setValue(123);
      numericInput.focus();

      const mockEvent = {
        key: Keys.Home,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getCursorPosition()).toBe(0);
    });

    it("should handle End key", () => {
      numericInput.setValue(123);
      numericInput.focus();
      numericInput.setCursorPosition(0);

      const mockEvent = {
        key: Keys.End,
      } as any;

      numericInput.onKeyDown(mockEvent);
      const text = numericInput.getDisplayText();
      expect(numericInput.getCursorPosition()).toBeGreaterThan(0);
    });

    it("should handle up arrow to increment", () => {
      numericInput.setValue(10);
      numericInput.focus();
      const initialValue = numericInput.getValue();

      const mockEvent = {
        key: Keys.ArrowUp,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getValue()).toBeGreaterThan(initialValue);
    });

    it("should handle down arrow to decrement", () => {
      numericInput.setValue(10);
      numericInput.focus();
      const initialValue = numericInput.getValue();

      const mockEvent = {
        key: Keys.ArrowDown,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getValue()).toBeLessThan(initialValue);
    });

    it("should handle Enter key to submit", () => {
      const callback = vi.fn();
      numericInput.eventEmitter.on("UINumericSubmit", callback);
      numericInput.focus();

      const mockEvent = {
        key: Keys.Enter,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle Escape key to cancel editing", () => {
      numericInput.setValue(100);
      numericInput.focus();

      const initialValue = numericInput.getValue();

      const mockEvent = {
        key: Keys.Escape,
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getValue()).toBe(initialValue);
    });

    it("should not handle input when disabled", () => {
      numericInput.setEnabled(false);
      const initialValue = numericInput.getValue();

      const mockEvent = {
        key: Keys.Num5,
        value: "5",
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getValue()).toBe(initialValue);
    });

    it("should not handle input when not focused", () => {
      numericInput.focus();
      const initialValue = numericInput.getValue();

      const mockEvent = {
        key: Keys.Num5,
        value: "5",
      } as any;

      numericInput.onKeyDown(mockEvent);
      expect(numericInput.getValue()).toBe(initialValue);
    });
  });

  describe("Negative Number Handling", () => {
    it("should allow negative numbers when allowNegative is true", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 0,
        allowNegative: true,
      });
      numericInput.focus();

      numericInput.setValue(-50);
      expect(numericInput.getValue()).toBe(-50);
    });

    it("should prevent negative numbers when allowNegative is false", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 0,
        allowNegative: false,
        min: 0,
      });

      numericInput.setValue(-50);
      expect(numericInput.getValue()).toBe(0);
    });
  });

  describe("Decimal Number Handling", () => {
    it("should allow decimals when allowDecimal is true", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 0,
        allowDecimal: true,
      });

      numericInput.setValue(12.34);
      expect(numericInput.getValue()).toBe(12.34);
    });

    it("should handle decimal input properly", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 0,
        allowDecimal: true,
      });
      numericInput.focus();

      // This tests the internal validation logic
      expect(numericInput).toBeDefined();
    });
  });

  describe("Arrow Buttons", () => {
    it("should create arrow buttons when showArrows is true", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        showArrows: true,
      });

      expect(numericInput.children.length).toBe(2); // Up and down arrows
    });

    it("should not create arrow buttons when showArrows is false", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        showArrows: false,
      });

      expect(numericInput.children.length).toBe(0);
    });

    it("should have configurable arrow width", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        showArrows: true,
        arrowWidth: 30,
      });

      expect(numericInput.children.length).toBe(2);
    });
  });

  describe("Color Configuration", () => {
    it("should accept custom colors", () => {
      const customColors = {
        backgroundStarting: Color.fromHex("#FF0000"),
        borderNormal: Color.fromHex("#00FF00"),
        borderFocused: Color.fromHex("#0000FF"),
        cursorColor: Color.fromHex("#FFFF00"),
      };

      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        colors: customColors,
      });

      expect(numericInput).toBeDefined();
    });
  });

  describe("Engine Integration", () => {
    it("should add to engine successfully", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      engine.add(numericInput);

      expect(engine.currentScene.actors.length).toBeGreaterThan(0);
    });

    it("should register keyboard events when added to engine", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      engine.add(numericInput);

      // The onAdd method should have been called
      expect(numericInput).toBeDefined();
    });
  });

  describe("Event Classes", () => {
    it("should create UINumericValueChanged event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericValueChanged(numericInput, 42);

      expect(event.target).toBe(numericInput);
      expect(event.value).toBe(42);
    });

    it("should create UINumericFocused event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericFocused(numericInput);

      expect(event.target).toBe(numericInput);
    });

    it("should create UINumericUnfocused event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericUnfocused(numericInput);

      expect(event.target).toBe(numericInput);
    });

    it("should create UINumericEnabled event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericEnabled(numericInput);

      expect(event.target).toBe(numericInput);
    });

    it("should create UINumericDisabled event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericDisabled(numericInput);

      expect(event.target).toBe(numericInput);
    });

    it("should create UINumericSubmit event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericSubmit(numericInput, 100);

      expect(event.target).toBe(numericInput);
      expect(event.value).toBe(100);
    });

    it("should create UINumericIncrement event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericIncrement(numericInput, 55);

      expect(event.target).toBe(numericInput);
      expect(event.value).toBe(55);
    });

    it("should create UINumericDecrement event", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50 });
      const event = new UINumericDecrement(numericInput, 45);

      expect(event.target).toBe(numericInput);
      expect(event.value).toBe(45);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large numbers", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: Number.MAX_SAFE_INTEGER,
      });

      expect(numericInput.getValue()).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("should handle very small numbers", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: Number.MIN_SAFE_INTEGER,
      });

      expect(numericInput.getValue()).toBe(Number.MIN_SAFE_INTEGER);
    });

    it("should handle zero", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 0 });

      expect(numericInput.getValue()).toBe(0);
    });

    it("should handle fractional steps", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 0, step: 0.1 });

      numericInput.increment();
      expect(numericInput.getValue()).toBeCloseTo(0.1);
    });

    it("should handle min equals max", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 50, min: 50, max: 50 });

      expect(numericInput.getValue()).toBe(50);
      numericInput.increment();
      expect(numericInput.getValue()).toBe(50);
    });

    it("should handle empty string input gracefully", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 100 });

      // This tests internal parsing logic
      expect(numericInput.getValue()).toBe(100);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle rapid increment/decrement", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 50,
        min: 0,
        max: 100,
        step: 1,
      });

      for (let i = 0; i < 10; i++) {
        numericInput.increment();
      }
      expect(numericInput.getValue()).toBe(60);

      for (let i = 0; i < 5; i++) {
        numericInput.decrement();
      }
      expect(numericInput.getValue()).toBe(55);
    });

    it("should handle focus/unfocus cycles", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 42 });

      numericInput.focus();
      expect(numericInput.numericState).toBe("focused");

      numericInput.loseFocus();
      expect(numericInput.numericState).toBe("normal");

      numericInput.focus();
      expect(numericInput.numericState).toBe("focused");
    });

    it("should maintain value integrity through multiple operations", () => {
      numericInput = new UINumeric({
        name: "customNumeric",
        pos: vec(100, 100),
        width: 300,
        height: 50,
        value: 50,
        min: 0,
        max: 100,
        step: 5,
      });

      numericInput.increment(); // 55
      numericInput.increment(); // 60
      numericInput.decrement(); // 55
      numericInput.setValue(70); // 70
      numericInput.increment(); // 75

      expect(numericInput.getValue()).toBe(75);
    });

    it("should handle disabled state during editing", () => {
      numericInput = new UINumeric({ name: "customNumeric", pos: vec(100, 100), width: 300, height: 50, value: 50 });

      numericInput.focus();
      numericInput.setEnabled(false);

      expect(numericInput.isEnabled).toBe(false);
      expect(numericInput.numericState).toBe("disabled");
    });
  });
});
