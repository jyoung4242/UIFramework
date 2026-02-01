import { beforeAll, vi } from "vitest";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// mock matchMedia for jsdom
if (!window.matchMedia) {
  window.matchMedia = (query: string) => {
    return {
      matches: false, // or true if you want to test dark mode
      media: query,
      onchange: null,
      addListener: () => {}, // legacy
      removeListener: () => {}, // legacy
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => {
    return {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: [] })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      closePath: vi.fn(),
      // Add these missing methods used by UICheckbox:
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      // These need to be properties with setters:
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      lineCap: "butt",
      lineJoin: "miter",
      filter: "none",
      globalCompositeOperation: "source-over",
    } as unknown as CanvasRenderingContext2D;
  });
});
