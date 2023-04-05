/* eslint-disable no-void */
export function getComputedStyle(el, key) {
  // eslint-disable-next-line no-nested-ternary
  return el && el.currentStyle ? el.currentStyle[key] : window.getComputedStyle ? window.getComputedStyle(el, void 0).getPropertyValue(key) : el.style[key]
}
