import { config } from "@vue/test-utils";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.CSS = {
  supports: () => false
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    }
  })
});

window.scrollTo = () => {};
window.visualViewport = {
  addEventListener() {},
  removeEventListener() {},
  width: 393,
  height: 852
};
config.global.stubs = {
  transition: false
};
