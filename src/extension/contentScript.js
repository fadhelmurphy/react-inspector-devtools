
function injectScript(file, node) {
    const th = document.getElementsByTagName(node)[0];
    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.runtime.getURL(file));
    th.appendChild(s);
  }
  
  injectScript('injected.bundle.js', 'body');
  
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.type && event.data.type === 'REACT_DEVTOOLS_AVAILABLE') {
    //   console.log('React DevTools is available');
      window.postMessage({ type: 'INIT_REACT_INSPECTOR' }, '*');
    }
  });
  