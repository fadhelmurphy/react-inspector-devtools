export const checkDevtoolsGlobalHook = () =>
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.size > 0 &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);

export const getDevtoolsGlobalHookRenderer = () => {
  if (!checkDevtoolsGlobalHook()) return null;
  return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
};

export const findFiberByHostInstance = (target) => {
  if (!checkDevtoolsGlobalHook()) return null;
  const renderer = getDevtoolsGlobalHookRenderer();
  return renderer ? renderer.findFiberByHostInstance(target) || null : null;
};

