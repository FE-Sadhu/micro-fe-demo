import { AppStatus } from "../index.js";
import { isPromise } from '../utils/index.js';

export default async function bootstrapApp(app) {
  const { bootstrap, mount, unmount } = await app.loadApp();

  app.bootstrap = bootstrap;
  app.mount = mount;
  app.unmount = unmount;

  try {
    app.props = getProps(app.props)
  } catch (error) {
    app.status = AppStatus.BOOTSTRAP_ERROR
    throw err
  }

  let result = app.bootstrap(app.props);
  if (!isPromise(result)) {
    result = Promise.resolve(result)
  }

  return result
    .then(() => {
        app.status = AppStatus.BOOTSTRAPPED
    })
    .catch((err) => {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    })
}

function getProps(props) {
  if (typeof props === 'function') return props()
  if (typeof props === 'object') return props
  return {}
}