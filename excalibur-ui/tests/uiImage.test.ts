import { describe, it, expect, beforeEach, vi } from "vitest";
import { Color, Engine, ImageSource, Sprite, vec } from "excalibur";
import { UIImage, UIImageConfig, UIImageShown, UIImageHidden, UIImageLoaded } from "../Components/uiImage";

describe("UIImage", () => {
  let mockEngine: Engine;

  beforeEach(() => {
    // Create a minimal mock engine
    mockEngine = {} as Engine;
  });

  describe("Constructor and Initialization", () => {
    it("should create with default configuration", () => {
      const uiImage = new UIImage({
        name: "test-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      expect(uiImage.name).toBe("test-image");
      expect(uiImage.width).toBe(100);
      expect(uiImage.height).toBe(100);
      expect(uiImage.isVisible).toBe(true);
    });

    it("should apply partial configuration with defaults", () => {
      const uiImage = new UIImage({
        name: "partial-image",
        width: 200,
        height: 150,
        pos: vec(10, 20),
      });

      expect(uiImage.name).toBe("partial-image");
      expect(uiImage.width).toBe(200);
      expect(uiImage.height).toBe(150);
      expect(uiImage.pos.x).toBe(10);
      expect(uiImage.pos.y).toBe(20);
    });

    it("should accept z-index configuration", () => {
      const uiImage = new UIImage({
        name: "z-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        z: 10,
      });

      expect(uiImage.z).toBe(10);
    });

    it("should accept visible configuration", () => {
      const uiImage = new UIImage({
        name: "hidden-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      expect(uiImage.isVisible).toBe(false);
    });

    it("should accept fit configuration", () => {
      const uiImage = new UIImage({
        name: "cover-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        fit: "cover",
      });

      expect(uiImage.fit).toBe("cover");
    });

    it("should accept color and border configuration", () => {
      const uiImage = new UIImage({
        name: "styled-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        backgroundColor: Color.Red,
        borderWidth: 2,
        borderColor: Color.Blue,
        borderRadius: 5,
      });

      expect(uiImage.name).toBe("styled-image");
    });
  });

  describe("Visibility Methods", () => {
    it("should show a hidden image", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      expect(uiImage.isVisible).toBe(false);
      uiImage.show();
      expect(uiImage.isVisible).toBe(true);
    });

    it("should hide a visible image", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      expect(uiImage.isVisible).toBe(true);
      uiImage.hide();
      expect(uiImage.isVisible).toBe(false);
    });

    it("should toggle visibility from visible to hidden", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      uiImage.toggle();
      expect(uiImage.isVisible).toBe(false);
    });

    it("should toggle visibility from hidden to visible", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      uiImage.toggle();
      expect(uiImage.isVisible).toBe(true);
    });

    it("should not emit show event if already visible", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      const showHandler = vi.fn();
      uiImage.emitter.on("UIImageShown", showHandler);

      uiImage.show();
      expect(showHandler).not.toHaveBeenCalled();
    });

    it("should not emit hide event if already hidden", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      const hideHandler = vi.fn();
      uiImage.emitter.on("UIImageHidden", hideHandler);

      uiImage.hide();
      expect(hideHandler).not.toHaveBeenCalled();
    });
  });

  describe("Event Emission", () => {
    it("should emit UIImageShown event when showing", () => {
      const uiImage = new UIImage({
        name: "test-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      const showHandler = vi.fn();
      uiImage.emitter.on("UIImageShown", showHandler);

      uiImage.show();

      expect(showHandler).toHaveBeenCalledTimes(1);
      expect(showHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test-image",
          target: uiImage,
          event: "shown",
        }),
      );
    });

    it("should emit UIImageHidden event when hiding", () => {
      const uiImage = new UIImage({
        name: "test-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      const hideHandler = vi.fn();
      uiImage.emitter.on("UIImageHidden", hideHandler);

      uiImage.hide();

      expect(hideHandler).toHaveBeenCalledTimes(1);
      expect(hideHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test-image",
          target: uiImage,
          event: "hidden",
        }),
      );
    });

    it("should emit UIImageLoaded event when setting image", () => {
      const uiImage = new UIImage({
        name: "test-image",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const loadHandler = vi.fn();
      uiImage.emitter.on("UIImageLoaded", loadHandler);

      const mockImageSource = {} as ImageSource;
      uiImage.setImage(mockImageSource);

      expect(loadHandler).toHaveBeenCalledTimes(1);
      expect(loadHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "test-image",
          target: uiImage,
          event: "loaded",
        }),
      );
    });

    it("should provide access to event emitter", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      expect(uiImage.eventEmitter).toBe(uiImage.emitter);
    });
  });

  describe("Image Management", () => {
    it("should set and get image with ImageSource", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const mockImageSource = {} as ImageSource;
      uiImage.setImage(mockImageSource);

      expect(uiImage.image).toBe(mockImageSource);
    });

    it("should set and get image with Sprite", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const mockSprite = {} as Sprite;
      uiImage.setImage(mockSprite);

      expect(uiImage.image).toBe(mockSprite);
    });

    it("should accept initial image in constructor", () => {
      const mockImageSource = {} as ImageSource;
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        image: mockImageSource,
      });

      expect(uiImage.image).toBe(mockImageSource);
    });

    it("should update image multiple times", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const image1 = {} as ImageSource;
      const image2 = {} as ImageSource;

      uiImage.setImage(image1);
      expect(uiImage.image).toBe(image1);

      uiImage.setImage(image2);
      expect(uiImage.image).toBe(image2);
    });
  });

  describe("Fit Mode Management", () => {
    it("should set and get fit mode", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        fit: "contain",
      });

      expect(uiImage.fit).toBe("contain");

      uiImage.setFit("cover");
      expect(uiImage.fit).toBe("cover");
    });

    it("should support all fit modes", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const fitModes: Array<"contain" | "cover" | "fill" | "scale-down" | "none"> = ["contain", "cover", "fill", "scale-down", "none"];

      fitModes.forEach(mode => {
        uiImage.setFit(mode);
        expect(uiImage.fit).toBe(mode);
      });
    });

    it("should have contain as default fit mode", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      expect(uiImage.fit).toBe("contain");
    });
  });

  describe("Lifecycle Methods", () => {
    it("should handle onAdd with visible state", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      expect(() => uiImage.onAdd(mockEngine)).not.toThrow();
    });

    it("should handle onAdd with hidden state", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: false,
      });

      expect(() => uiImage.onAdd(mockEngine)).not.toThrow();
    });

    it("should handle onRemove", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      expect(() => uiImage.onRemove(mockEngine)).not.toThrow();
    });
  });

  describe("Event Classes", () => {
    it("should create UIImageShown event", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const event = new UIImageShown(uiImage);
      expect(event.target).toBe(uiImage);
    });

    it("should create UIImageHidden event", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const event = new UIImageHidden(uiImage);
      expect(event.target).toBe(uiImage);
    });

    it("should create UIImageLoaded event", () => {
      const uiImage = new UIImage({
        name: "test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const event = new UIImageLoaded(uiImage);
      expect(event.target).toBe(uiImage);
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete visibility workflow", () => {
      const uiImage = new UIImage({
        name: "workflow-test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
        visible: true,
      });

      const showHandler = vi.fn();
      const hideHandler = vi.fn();

      uiImage.emitter.on("UIImageShown", showHandler);
      uiImage.emitter.on("UIImageHidden", hideHandler);

      // Hide it
      uiImage.hide();
      expect(uiImage.isVisible).toBe(false);
      expect(hideHandler).toHaveBeenCalledTimes(1);

      // Show it
      uiImage.show();
      expect(uiImage.isVisible).toBe(true);
      expect(showHandler).toHaveBeenCalledTimes(1);

      // Toggle it twice
      uiImage.toggle();
      expect(uiImage.isVisible).toBe(false);
      expect(hideHandler).toHaveBeenCalledTimes(2);

      uiImage.toggle();
      expect(uiImage.isVisible).toBe(true);
      expect(showHandler).toHaveBeenCalledTimes(2);
    });

    it("should handle image updates with events", () => {
      const uiImage = new UIImage({
        name: "update-test",
        width: 100,
        height: 100,
        pos: vec(0, 0),
      });

      const loadHandler = vi.fn();
      uiImage.emitter.on("UIImageLoaded", loadHandler);

      const image1 = {} as ImageSource;
      const image2 = {} as Sprite;
      const image3 = {} as ImageSource;

      uiImage.setImage(image1);
      uiImage.setImage(image2);
      uiImage.setImage(image3);

      expect(loadHandler).toHaveBeenCalledTimes(3);
      expect(uiImage.image).toBe(image3);
    });

    it("should handle complete configuration workflow", () => {
      const uiImage = new UIImage({
        name: "config-test",
        width: 200,
        height: 150,
        pos: vec(50, 100),
        z: 5,
        fit: "contain",
        backgroundColor: Color.Red,
        borderWidth: 3,
        borderColor: Color.Blue,
        borderRadius: 10,
        visible: true,
      });

      const mockImage = {} as ImageSource;

      uiImage.setImage(mockImage);
      expect(uiImage.image).toBe(mockImage);

      uiImage.setFit("cover");
      expect(uiImage.fit).toBe("cover");

      uiImage.hide();
      expect(uiImage.isVisible).toBe(false);

      uiImage.show();
      expect(uiImage.isVisible).toBe(true);
    });
  });
});
