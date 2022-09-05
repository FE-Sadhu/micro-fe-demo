export function isPromise(fn) {
  if ((typeof fn === 'object' || typeof fn === 'function') && typeof fn.then === 'function') {
      return true
  }
}

export function $(selector) {
  return document.querySelector(selector)
}