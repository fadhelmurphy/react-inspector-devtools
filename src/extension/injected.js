import { init } from "../overlay/inspector";

(function() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      window.postMessage({ type: 'REACT_DEVTOOLS_AVAILABLE' }, '*');
    }
  
    function initReactInspector() {
        console.log('FDL React Inspector Initialized');
        init()
      }
  
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (event.data.type && event.data.type === 'INIT_REACT_INSPECTOR') {
        initReactInspector();
      }
    });
  })();
  