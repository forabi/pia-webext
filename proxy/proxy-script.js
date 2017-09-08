let config = {
  bypassList: [],
  password: '',
  username: '',
  proxy: {
    dns: 'https-us-west.privateinternetaccess.com',
    port: 443,
  },
};

// Tell the background script that we are ready
browser.runtime.sendMessage("init");

browser.runtime.onMessage.addListener((message) => {
  config = {
    ...config,
    ...message,
  };

  return true;
});

/**
 * Required function that will be called to determine if a proxy should be used
 * @param {string} url The full URL of the request
 * @param {string} host Host extracted from `url` for convenience 
 */
function FindProxyForURL(url, host) {
  if (config.bypassList.indexOf(host) !== -1) {
    return 'DIRECT';
  }
  return `HTTPS ${config.proxy.dns}:${config.proxy.port}`;
}
