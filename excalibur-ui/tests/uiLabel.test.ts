import { describe, it, expect, beforeEach, vi } from "vitest";
import { UILabel, UILabelConfig } from "../Components/";
import { Color, Font, vec } from "excalibur";

describe("UILabel", () => {
  let label: UILabel;

  beforeEach(() => {
    label = new UILabel({
      name: "TestLabel",
      width: 200,
      height: 100,
      pos: vec(50, 50),
      text: "Hello World",
    });
  });

  describe("Initialization", () => {
    it("should create a label with default config", () => {
      const defaultLabel = new UILabel({});
      expect(defaultLabel.name).toBe("UILabel");
      expect(defaultLabel.width).toBe(100);
      expect(defaultLabel.height).toBe(50);
    });

    it("should create a label with custom config", () => {
      expect(label.name).toBe("TestLabel");
      expect(label.width).toBe(200);
      expect(label.height).toBe(100);
      expect(label.pos.x).toBe(50);
      expect(label.pos.y).toBe(50);
    });

    it("should initialize with provided text", () => {
      expect(label.getText()).toBe("Hello World");
    });

    it("should initialize with empty text when not provided", () => {
      const emptyLabel = new UILabel({ name: "Empty" });
      expect(emptyLabel.getText()).toBe("");
    });

    it("should start in normal state", () => {
      expect(label.labelState).toBe("idle");
    });
  });

  describe("setText and getText", () => {
    it("should update text", () => {
      label.setText("New Text");
      expect(label.getText()).toBe("New Text");
    });

    it("should emit UILabelTextChanged event when text changes", () => {
      const listener = vi.fn();
      label.emitter.on("UILabelTextChanged", listener);

      label.setText("Changed");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "TestLabel",
          target: label,
          event: "textChanged",
          text: "Changed",
        }),
      );
    });

    it("should not emit event when text is set to same value", () => {
      const listener = vi.fn();
      label.emitter.on("UILabelTextChanged", listener);

      label.setText("Hello World");

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("setEnabled", () => {
    it("should enable the label", () => {
      label.setEnabled(false);
      label.setEnabled(true);

      expect(label.labelState).toBe("idle");
    });

    it("should disable the label", () => {
      label.setEnabled(false);

      expect(label.labelState).toBe("disabled");
    });

    it("should emit UILabelEnabled event when enabled", () => {
      const listener = vi.fn();
      label.setEnabled(false);
      label.emitter.on("UILabelEnabled", listener);

      label.setEnabled(true);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "TestLabel",
          target: label,
          event: "enabled",
        }),
      );
    });

    it("should emit UILabelDisabled event when disabled", () => {
      const listener = vi.fn();
      label.emitter.on("UILabelDisabled", listener);

      label.setEnabled(false);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "TestLabel",
          target: label,
          event: "disabled",
        }),
      );
    });

    it("should not emit events when setting same enabled state", () => {
      const enabledListener = vi.fn();
      const disabledListener = vi.fn();

      label.emitter.on("UILabelEnabled", enabledListener);
      label.emitter.on("UILabelDisabled", disabledListener);

      label.setEnabled(false);

      expect(enabledListener).not.toHaveBeenCalled();
      expect(disabledListener).toHaveBeenCalled();
    });
  });

  describe("Custom Configuration", () => {
    it("should accept custom colors", () => {
      const coloredLabel = new UILabel({
        name: "Colored",
        colors: {
          backgroundStarting: Color.Blue,
          backgroundEnding: Color.Red,
          disabledStarting: Color.Gray,
          disabledEnding: Color.DarkGray,
        },
      });

      expect(coloredLabel).toBeDefined();
    });

    it("should accept custom label radius", () => {
      const roundedLabel = new UILabel({
        name: "Rounded",
        labelRadius: 16,
      });

      expect(roundedLabel).toBeDefined();
    });

    it("should accept custom padding", () => {
      const paddedLabel = new UILabel({
        name: "Padded",
        padding: vec(16, 16),
      });

      expect(paddedLabel).toBeDefined();
    });

    it("should accept custom z-index", () => {
      const zLabel = new UILabel({
        name: "ZIndexed",
        z: 10,
      });

      expect(zLabel).toBeDefined();
    });
  });

  describe("Event Emitter", () => {
    it("should provide access to event emitter", () => {
      expect(label.eventEmitter).toBe(label.emitter);
    });

    it("should allow multiple listeners on same event", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      label.emitter.on("UILabelTextChanged", listener1);
      label.emitter.on("UILabelTextChanged", listener2);

      label.setText("Test");

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("State Management", () => {
    it("should transition between states correctly", () => {
      expect(label.labelState).toBe("idle");

      label.setEnabled(false);
      expect(label.labelState).toBe("disabled");

      label.setEnabled(true);
      expect(label.labelState).toBe("idle");
    });

    it("should maintain text across state changes", () => {
      label.setText("Persistent");
      label.setEnabled(false);

      expect(label.getText()).toBe("Persistent");

      label.setEnabled(true);
      expect(label.getText()).toBe("Persistent");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string text", () => {
      label.setText("");
      expect(label.getText()).toBe("");
    });

    it("should handle very long text", () => {
      const longText = "A".repeat(1000);
      label.setText(longText);
      expect(label.getText()).toBe(longText);
    });

    it("should handle special characters in text", () => {
      const specialText = "!@#$%^&*()_+-={}[]|\\:\";'<>?,./";
      label.setText(specialText);
      expect(label.getText()).toBe(specialText);
    });

    it("should handle unicode characters", () => {
      const unicodeText = "你好世界 🎮 Ñoño";
      label.setText(unicodeText);
      expect(label.getText()).toBe(unicodeText);
    });
  });
});
