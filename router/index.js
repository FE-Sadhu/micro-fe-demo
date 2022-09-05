const originalPushState = window.history.pushState
const originalReplaceState = window.history.replaceState

// 路由改变时，操作子应用的挂载、卸载。
export function overwriteEventsAndHistory() {
  window.history.pushState = function (state, title, url) {
    const result = originalPushState.call(this, state, title, url)
    loadApps()
    return result
  }

  window.history.replaceState = function (state, title, url) {
      const result = originalReplaceState.call(this, state, title, url)
      loadApps()
      return result
  }

  window.addEventListener('popstate', () => {
      loadApps()
  }, true) // true - 捕获阶段

  window.addEventListener('hashchange', () => {
      loadApps()
  }, true)
}