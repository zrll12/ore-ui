// JSDOM has no layout observer or scrolling; browser QA covers popup geometry.
if (!globalThis.ResizeObserver) globalThis.ResizeObserver = class {
  observe() {} unobserve() {} disconnect() {}
};
if (!HTMLElement.prototype.scrollIntoView) HTMLElement.prototype.scrollIntoView = () => {};
if (!HTMLElement.prototype.scrollTo) HTMLElement.prototype.scrollTo = () => {};
