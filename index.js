import { overwriteEventsAndHistory } from './router/index.js';
import { loadApps } from "./src/index.js";
export { registerApplication } from "./src/index.js";

// 是否运行在 single spa 下
window.__IS_SINGLE_SPA__ = true

overwriteEventsAndHistory();


let isStarted = false
export function start() {
    if (!isStarted) {
        isStarted = true
        loadApps()
    }
}

export function isStart() {
    return isStarted
}