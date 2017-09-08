// Tell the background script that we are ready


let config;

function setConfig(update) {
  if (update.isDisabled) {
    config = undefined;
  } else {
    config = {
      ...config,
      bypassList: [...update.bypassList],
      proxy: {
        ...update.serverList[update.serverKey],
      },
    };
  }
}

browser.runtime.sendMessage("init");

browser.runtime.onMessage.addListener((message) => {
  setConfig(message);
  return true;
});

/**
 * Required function that will be called to determine if a proxy should be used
 * @param {string} url The full URL of the request
 * @param {string} host Host extracted from `url` for convenience 
 */
function FindProxyForURL(url, host) {
  if (config === undefined) {
    return 'DIRECT';
  }
  if (config.bypassList.indexOf(host) !== -1) {
    return 'DIRECT';
  }
  return `HTTPS ${config.proxy.dns}:${config.proxy.port}`;
}
