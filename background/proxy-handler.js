// Location of the proxy script, relative to manifest.json
const proxyScriptURL = "proxy/proxy-script.js";

// Default settings. If there is nothing in storage, use these values.
const defaultSettings = {
  bypassList: [],
  username: null,
  password: null,
  serverKey: undefined,
  serverList: {

  },
  isDisabled: true,
};

let config = {
  ...defaultSettings,
};

// Log any errors from the proxy script
browser.proxy.register(proxyScriptURL);

browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

browser.storage.onChanged.addListener(async (newConfig) => {
  console.log('Configuration changed', newConfig);
  for (const key of Object.keys(newConfig)) {
    console.log(key, newConfig[key]);
    config[key] = newConfig[key].newValue;
  }
  browser.runtime.sendMessage(config, { toProxyScript: true });
});

// Initialize the proxy
async function handleInit() {
  config = {
    ...config,
    ...(await browser.storage.local.get()),
  };

  console.log('Loaded config', config);

  try {
    browser.webRequest.onAuthRequired.addListener(
      async (details) => {
        console.log('Handling request', details.url, details);
        const { username, password } = await browser.storage.local.get(['username', 'password']);
        if (!details.isProxy || !username || !password) {
          return { };
        }
        return {
          authCredentials: {
            username: username,
            password: password,
          }
        };
      },
      {
        urls: [
          '<all_urls>',
        ],
      },
      ['blocking']
    );
    browser.runtime.sendMessage(config, { toProxyScript: true });
  } catch (e) {
    console.log("Error retrieving stored settings");
  }
}

function handleMessage(message, sender) {
  // only handle messages from the proxy script
  if (sender.url !== browser.extension.getURL(proxyScriptURL)) {
    return;
  }

  if (message === "init") {
    handleInit();
  } else {
    // after the init message the only other messages are status messages
    console.log('Proxy script sent message', message);
  }

  return true;
}

browser.runtime.onMessage.addListener(handleMessage);
