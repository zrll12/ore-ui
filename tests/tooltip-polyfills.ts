import './select-polyfills';
// jsdom lacks PointerEvent; retain pointerType so touch-hover behavior is exercised.
if (!window.PointerEvent) {
  class TestPointerEvent extends MouseEvent {
    readonly pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerType = init.pointerType ?? 'mouse'; }
  }
  Object.defineProperty(window, 'PointerEvent', { value: TestPointerEvent, configurable: true });
  Object.defineProperty(globalThis, 'PointerEvent', { value: TestPointerEvent, configurable: true });
}
