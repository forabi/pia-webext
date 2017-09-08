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

// Tell the background script that we are ready
browser.runtime.sendMessage('init');

browser.runtime.onMessage.addListener(message => {
  setConfig(message);
  return true;
});

function FindProxyForURL(url: string, host: string) {
  if (config === undefined) {
    return 'DIRECT';
  }
  if (
    url === config.proxy.dns ||
    url === 'https://www.privateinternetaccess.com/api/client/services/https' ||
    config.bypassList.indexOf(host) !== -1
  ) {
    return 'DIRECT';
  }
  return `HTTPS ${config.proxy.dns}:${config.proxy.port}`;
}
