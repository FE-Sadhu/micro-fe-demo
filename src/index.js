import bootstrapApp from './lifecycle/bootstrap.js';
import mountApp from './lifecycle/mount.js';
import unMountApp from './lifecycle/unmount.js';

// 子应用的状态
export const AppStatus = {
  BEFORE_BOOTSTRAP: 'BEFORE_BOOTSTRAP',
  BOOTSTRAPPED: 'BOOTSTRAPPED',
  BEFORE_MOUNT: 'BEFORE_MOUNT',
  MOUNTED: 'MOUNTED',
  BEFORE_UNMOUNT: 'BEFORE_UNMOUNT',
  UNMOUNTED: 'UNMOUNTED',
  BOOTSTRAP_ERROR: 'BOOTSTRAP_ERROR',
  MOUNT_ERROR: 'MOUNT_ERROR',
  UNMOUNT_ERROR: 'UNMOUNT_ERROR',
}
/*
const type = { 
  name: string;
  loadApp: () => Promise<{
    bootstrap: Function;
    mount: Function;
    unmount: Function;
  }>;
  activeRule: (location: Location) => boolean | string;
  props: object | () => object; // 作为生命周期函数的参数
  / * 以下是框架方便调用，把 loadApp 返回值加过来的 * /
  bootstrap: Function;
  mount: Function;
  unmount: Function;
}
*/
const apps = []; // 子应用集合

export function registerApplication(app) {
  if (typeof app.activeRule === 'string') {
      const path = app.activeRule
      app.activeRule = (location = window.location) => location.pathname === path
  }

  app.status = AppStatus.BEFORE_BOOTSTRAP
  apps.push(app)
}


// 初始化或路由改变时，操作子应用
export async function loadApps() {
    // 先卸载所有失活的子应用
    const toUnMountApp = getAppsWithStatus(AppStatus.MOUNTED)
    await Promise.all(toUnMountApp.map(unMountApp))
    
    // 初始化所有刚注册的子应用
    const toLoadApp = getAppsWithStatus(AppStatus.BEFORE_BOOTSTRAP)
    await Promise.all(toLoadApp.map(bootstrapApp))

    const toMountApp = [
        ...getAppsWithStatus(AppStatus.BOOTSTRAPPED),
        ...getAppsWithStatus(AppStatus.UNMOUNTED),
    ]
    // 加载所有符合条件的子应用
    await toMountApp.map(mountApp)
}



function getAppsWithStatus(status) {
  const result = []
  apps.forEach(app => {
      // tobootstrap or tomount
      // 符合子应用加载的条件，且子应用处于失活状态时(BEFORE_BOOTSTRAP、BOOTSTRAPPED、UNMOUNTED)
      if (isActive(app) && app.status === status) {
          switch (app.status) {
              case AppStatus.BEFORE_BOOTSTRAP:
              case AppStatus.BOOTSTRAPPED:
              case AppStatus.UNMOUNTED:
                  result.push(app)
                  break
          }
      } else if (app.status === AppStatus.MOUNTED && status === AppStatus.MOUNTED) {
          // tounmount
          // 不符合子应用加载条件，且处于加载条件时
          result.push(app)
      }
      // 不符合子应用加载条件，且处于失活状态，不做处理
      // 符合子应用加载条件，且处于挂载状态，不做处理
  })

  return result
}

function isActive(app) {
  return typeof app.activeRule === 'function' && app.activeRule(window.location)
}