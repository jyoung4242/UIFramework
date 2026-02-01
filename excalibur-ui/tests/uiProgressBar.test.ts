import { describe, it, expect, beforeEach, vi } from "vitest";
import { Color, vec } from "excalibur";
import {
  UIProgressBar,
  UISpriteProgressBar,
  UIProgressBarChanged,
  UIProgressBarComplete,
  UIProgressBarEmpty,
} from "../Components/uiProgress";

describe("UIProgressBar", () => {
  describe("constructor", () => {
    it("should create a progress bar with default config", () => {
      const progressBar = new UIProgressBar({});

      expect(progressBar.name).toBe("UIProgressBar");
      expect(progressBar.width).toBe(200);
      expect(progressBar.height).toBe(24);
      expect(progressBar.value).toBe(50);
      expect(progressBar.percent).toBe(0.5);
    });

    it("should create a progress bar with custom config", () => {
      const progressBar = new UIProgressBar({
        name: "CustomBar",
        width: 300,
        height: 40,
        min: 0,
        max: 200,
        value: 100,
        pos: vec(50, 100),
      });

      expect(progressBar.name).toBe("CustomBar");
      expect(progressBar.width).toBe(300);
      expect(progressBar.height).toBe(40);
      expect(progressBar.value).toBe(100);
      expect(progressBar.percent).toBe(0.5);
      expect(progressBar.pos.x).toBe(50);
      expect(progressBar.pos.y).toBe(100);
    });

    it("should handle custom min/max ranges", () => {
      const progressBar = new UIProgressBar({
        min: 10,
        max: 110,
        value: 60,
      });

      expect(progressBar.value).toBe(60);
      expect(progressBar.percent).toBe(0.5);
    });
  });

  describe("value setter", () => {
    let progressBar: UIProgressBar;

    beforeEach(() => {
      progressBar = new UIProgressBar({
        name: "CustomBar",
        width: 300,
        height: 40,
        min: 0,
        max: 100,
        value: 50,
      });
    });

    it("should update value within range", () => {
      progressBar.value = 75;
      expect(progressBar.value).toBe(75);
      expect(progressBar.percent).toBe(0.75);
    });

    it("should clamp value to minimum", () => {
      progressBar.value = -10;
      expect(progressBar.value).toBe(0);
      expect(progressBar.percent).toBe(0);
    });

    it("should clamp value to maximum", () => {
      progressBar.value = 150;
      expect(progressBar.value).toBe(100);
      expect(progressBar.percent).toBe(1);
    });

    it("should not emit event when value doesn't change", () => {
      const changedSpy = vi.fn();
      progressBar.emitter.on("UIProgressBarChanged", changedSpy);

      progressBar.value = 50;
      expect(changedSpy).not.toHaveBeenCalled();
    });

    it("should emit UIProgressBarChanged event when value changes", () => {
      const changedSpy = vi.fn();
      progressBar.emitter.on("UIProgressBarChanged", changedSpy);

      progressBar.value = 75;

      expect(changedSpy).toHaveBeenCalledTimes(1);
      expect(changedSpy).toHaveBeenCalledWith({
        name: "CustomBar",
        event: "changed",
        value: 75,
        percent: 0.75,
        target: progressBar,
      });
    });
  });

  describe("percent getter", () => {
    it("should calculate correct percentage", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 25,
      });

      expect(progressBar.percent).toBe(0.25);
    });

    it("should handle non-zero minimum correctly", () => {
      const progressBar = new UIProgressBar({
        min: 50,
        max: 150,
        value: 100,
      });

      expect(progressBar.percent).toBe(0.5);
    });

    it("should return 0 when at minimum", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 0,
      });

      expect(progressBar.percent).toBe(0);
    });

    it("should return 1 when at maximum", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 100,
      });

      expect(progressBar.percent).toBe(1);
    });
  });

  describe("UIProgressBarComplete event", () => {
    let progressBar: UIProgressBar;
    let completeSpy = vi.fn();
    beforeEach(() => {
      progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 50,
      });
      completeSpy = vi.fn();
      progressBar.emitter.on("UIProgressBarComplete", completeSpy);
    });

    it("should emit when reaching max from below", () => {
      progressBar.value = 100;

      expect(completeSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledWith({ name: "UIProgressBar", target: progressBar, event: "complete" });
    });

    it("should emit when exceeding max", () => {
      progressBar.value = 150;

      expect(completeSpy).toHaveBeenCalledTimes(1);
    });

    it("should not emit when already at max", () => {
      progressBar.value = 100;
      completeSpy.mockClear();

      progressBar.value = 100;

      expect(completeSpy).not.toHaveBeenCalled();
    });

    it("should not emit when going from max to below max", () => {
      progressBar.value = 100;
      completeSpy.mockClear();

      progressBar.value = 50;

      expect(completeSpy).not.toHaveBeenCalled();
    });
  });

  describe("UIProgressBarEmpty event", () => {
    let progressBar: UIProgressBar;
    let emptySpy = vi.fn();

    beforeEach(() => {
      progressBar = new UIProgressBar({
        name: "CustomBar",
        width: 300,
        height: 40,
        min: 0,
        max: 100,
        value: 50,
      });
      emptySpy = vi.fn();
      progressBar.emitter.on("UIProgressBarEmpty", emptySpy);
    });

    it("should emit when reaching min from above", () => {
      progressBar.value = 0;

      expect(emptySpy).toHaveBeenCalledTimes(1);
      expect(emptySpy).toHaveBeenCalledWith({ name: "CustomBar", target: progressBar, event: "empty" });
    });

    it("should emit when going below min", () => {
      progressBar.value = -10;

      expect(emptySpy).toHaveBeenCalledTimes(1);
    });

    it("should not emit when already at min", () => {
      progressBar.value = 0;
      emptySpy.mockClear();

      progressBar.value = 0;

      expect(emptySpy).not.toHaveBeenCalled();
    });

    it("should not emit when going from min to above min", () => {
      progressBar.value = 0;
      emptySpy.mockClear();

      progressBar.value = 50;

      expect(emptySpy).not.toHaveBeenCalled();
    });
  });

  describe("increment", () => {
    let progressBar: UIProgressBar;

    beforeEach(() => {
      progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 50,
      });
    });

    it("should increment by 1 by default", () => {
      progressBar.increment();
      expect(progressBar.value).toBe(51);
    });

    it("should increment by specified amount", () => {
      progressBar.increment(10);
      expect(progressBar.value).toBe(60);
    });

    it("should not exceed maximum", () => {
      progressBar.increment(60);
      expect(progressBar.value).toBe(100);
    });

    it("should handle negative increments", () => {
      progressBar.increment(-10);
      expect(progressBar.value).toBe(40);
    });
  });

  describe("decrement", () => {
    let progressBar: UIProgressBar;

    beforeEach(() => {
      progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 50,
      });
    });

    it("should decrement by 1 by default", () => {
      progressBar.decrement();
      expect(progressBar.value).toBe(49);
    });

    it("should decrement by specified amount", () => {
      progressBar.decrement(10);
      expect(progressBar.value).toBe(40);
    });

    it("should not go below minimum", () => {
      progressBar.decrement(60);
      expect(progressBar.value).toBe(0);
    });

    it("should handle negative decrements", () => {
      progressBar.decrement(-10);
      expect(progressBar.value).toBe(60);
    });
  });

  describe("reset", () => {
    it("should reset value to minimum", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 75,
      });

      progressBar.reset();
      expect(progressBar.value).toBe(0);
    });

    it("should reset to custom minimum", () => {
      const progressBar = new UIProgressBar({
        min: 20,
        max: 100,
        value: 75,
      });

      progressBar.reset();
      expect(progressBar.value).toBe(20);
    });

    it("should emit empty event when resetting from above min", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 75,
      });
      const emptySpy = vi.fn();
      progressBar.emitter.on("UIProgressBarEmpty", emptySpy);

      progressBar.reset();

      expect(emptySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("complete", () => {
    it("should set value to maximum", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 25,
      });

      progressBar.complete();
      expect(progressBar.value).toBe(100);
    });

    it("should set to custom maximum", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 200,
        value: 50,
      });

      progressBar.complete();
      expect(progressBar.value).toBe(200);
    });

    it("should emit complete event when completing from below max", () => {
      const progressBar = new UIProgressBar({
        min: 0,
        max: 100,
        value: 25,
      });
      const completeSpy = vi.fn();
      progressBar.emitter.on("UIProgressBarComplete", completeSpy);

      progressBar.complete();

      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("enabled state", () => {
    let progressBar: UIProgressBar;

    beforeEach(() => {
      progressBar = new UIProgressBar({});
    });

    it("should be enabled by default", () => {
      expect(progressBar.isEnabled).toBe(true);
    });

    it("should allow disabling", () => {
      progressBar.setEnabled(false);
      expect(progressBar.isEnabled).toBe(false);
    });

    it("should allow re-enabling", () => {
      progressBar.setEnabled(false);
      progressBar.setEnabled(true);
      expect(progressBar.isEnabled).toBe(true);
    });
  });

  describe("configuration options", () => {
    it("should support horizontal orientation", () => {
      const progressBar = new UIProgressBar({
        orientation: "horizontal",
      });

      expect(progressBar).toBeDefined();
    });

    it("should support vertical orientation", () => {
      const progressBar = new UIProgressBar({
        orientation: "vertical",
      });

      expect(progressBar).toBeDefined();
    });

    it("should accept custom colors", () => {
      const progressBar = new UIProgressBar({
        colors: {
          track: Color.Red,
          fill: Color.Green,
          border: Color.Blue,
          disabled: Color.Gray,
        },
      });

      expect(progressBar).toBeDefined();
    });

    it("should accept percentage display settings", () => {
      const progressBar = new UIProgressBar({
        showPercentage: true,
        percentageTextColor: Color.Black,
        percentageTextSize: 16,
      });

      expect(progressBar).toBeDefined();
    });
  });
});

describe("UISpriteProgressBar", () => {
  describe("constructor", () => {
    it("should create a sprite progress bar with default config", () => {
      const progressBar = new UISpriteProgressBar({});

      expect(progressBar.name).toBe("UISpriteProgressBar");
      expect(progressBar.width).toBe(200);
      expect(progressBar.height).toBe(24);
      expect(progressBar.value).toBe(50);
      expect(progressBar.percent).toBe(0.5);
    });

    it("should create with null sprites by default", () => {
      const progressBar = new UISpriteProgressBar({});

      expect(progressBar.trackSprite).toBeNull();
      expect(progressBar.fillSprite).toBeNull();
      expect(progressBar.borderSprite).toBeNull();
    });

    it("should accept custom sprites", () => {
      const mockTrack = {} as any;
      const mockFill = {} as any;
      const mockBorder = {} as any;

      const progressBar = new UISpriteProgressBar({
        sprites: {
          track: mockTrack,
          fill: mockFill,
          border: mockBorder,
        },
      });

      expect(progressBar.trackSprite).toBe(mockTrack);
      expect(progressBar.fillSprite).toBe(mockFill);
      expect(progressBar.borderSprite).toBe(mockBorder);
    });
  });

  describe("value management", () => {
    let progressBar: UISpriteProgressBar;

    beforeEach(() => {
      progressBar = new UISpriteProgressBar({
        min: 0,
        max: 100,
        value: 50,
      });
    });

    it("should update value correctly", () => {
      progressBar.value = 75;
      expect(progressBar.value).toBe(75);
      expect(progressBar.percent).toBe(0.75);
    });

    it("should clamp to min and max", () => {
      progressBar.value = -10;
      expect(progressBar.value).toBe(0);

      progressBar.value = 150;
      expect(progressBar.value).toBe(100);
    });

    it("should emit events on value change", () => {
      const changedSpy = vi.fn();
      progressBar.emitter.on("UIProgressBarChanged", changedSpy);

      progressBar.value = 80;

      expect(changedSpy).toHaveBeenCalledWith({
        value: 80,
        event: "changed",
        name: "UISpriteProgressBar",
        percent: 0.8,
        target: progressBar,
      });
    });
  });

  describe("methods", () => {
    let progressBar: UISpriteProgressBar;

    beforeEach(() => {
      progressBar = new UISpriteProgressBar({
        min: 0,
        max: 100,
        value: 50,
      });
    });

    it("should increment correctly", () => {
      progressBar.increment(10);
      expect(progressBar.value).toBe(60);
    });

    it("should decrement correctly", () => {
      progressBar.decrement(10);
      expect(progressBar.value).toBe(40);
    });

    it("should reset to minimum", () => {
      progressBar.reset();
      expect(progressBar.value).toBe(0);
    });

    it("should complete to maximum", () => {
      progressBar.complete();
      expect(progressBar.value).toBe(100);
    });
  });

  describe("enabled state", () => {
    let progressBar: UISpriteProgressBar;

    beforeEach(() => {
      progressBar = new UISpriteProgressBar({});
    });

    it("should manage enabled state", () => {
      expect(progressBar.isEnabled).toBe(true);

      progressBar.setEnabled(false);
      expect(progressBar.isEnabled).toBe(false);

      progressBar.setEnabled(true);
      expect(progressBar.isEnabled).toBe(true);
    });
  });
});

describe("Event Classes", () => {
  describe("UIProgressBarChanged", () => {
    it("should create event with correct properties", () => {
      const progressBar = new UIProgressBar({});
      const event = new UIProgressBarChanged(progressBar, 75, 0.75);

      expect(event.target).toBe(progressBar);
      expect(event.value).toBe(75);
      expect(event.percent).toBe(0.75);
    });
  });

  describe("UIProgressBarComplete", () => {
    it("should create event with target", () => {
      const progressBar = new UIProgressBar({});
      const event = new UIProgressBarComplete(progressBar);

      expect(event.target).toBe(progressBar);
    });
  });

  describe("UIProgressBarEmpty", () => {
    it("should create event with target", () => {
      const progressBar = new UIProgressBar({});
      const event = new UIProgressBarEmpty(progressBar);

      expect(event.target).toBe(progressBar);
    });
  });
});

describe("Edge Cases", () => {
  it("should handle zero range (min === max)", () => {
    const progressBar = new UIProgressBar({
      min: 50,
      max: 50,
      value: 50,
    });

    // This will result in NaN due to division by zero
    // The component should handle this gracefully
    expect(progressBar.value).toBe(50);
  });

  it("should handle very large ranges", () => {
    const progressBar = new UIProgressBar({
      min: 0,
      max: 1000000,
      value: 500000,
    });

    expect(progressBar.percent).toBe(0.5);
  });

  it("should handle negative ranges", () => {
    const progressBar = new UIProgressBar({
      min: -100,
      max: 100,
      value: 0,
    });

    expect(progressBar.percent).toBe(0.5);
  });

  it("should handle fractional values", () => {
    const progressBar = new UIProgressBar({
      min: 0,
      max: 1,
      value: 0.5,
    });

    expect(progressBar.percent).toBe(0.5);
  });

  it("should handle multiple rapid value changes", () => {
    const progressBar = new UIProgressBar({
      min: 0,
      max: 100,
      value: 0,
    });
    const changedSpy = vi.fn();
    progressBar.emitter.on("UIProgressBarChanged", changedSpy);

    for (let i = 1; i <= 10; i++) {
      progressBar.value = i * 10;
    }

    expect(changedSpy).toHaveBeenCalledTimes(10);
    expect(progressBar.value).toBe(100);
  });
});
