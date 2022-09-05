import { isPromise } from '../utils/index.js';
import { AppStatus } from "../index.js";


export default function unMountApp(app) {
    app.status = AppStatus.BEFORE_UNMOUNT

    let result = app.unmount(app.props)
    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }
    
    return result
    .then(() => {
        app.status = AppStatus.UNMOUNTED
    })
    .catch((err) => {
        app.status = AppStatus.UNMOUNT_ERROR
        throw err
    })
}