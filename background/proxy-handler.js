// Location of the proxy script, relative to manifest.json
const proxyScriptURL = "proxy/proxy-script.pac";

// Default settings. If there is nothing in storage, use these values.
const defaultSettings = {
  bypassList: [],
  username: null,
  password: null,
  proxy: {
    dns: 'https-us-west.privateinternetaccess.com',
    port: 443,
  },
};

// Register the proxy script
browser.proxy.register(proxyScriptURL);

// Log any errors from the proxy script
browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

// Initialize the proxy
async function handleInit() {
  let config = {
    ...defaultSettings,
    ...(await browser.storage.local.get()),
  };

  await browser.storage.local.set(config);

  browser.storage.onChanged.addListener((newSettings) => {
    config.username = newSettings.username.newValue;
    config.password = newSettings.password.newValue;
    config.bypassList = newSettings.bypassList.newValue;
    browser.runtime.sendMessage(config, { toProxyScript: true });
  });

  try {
    browser.webRequest.onAuthRequired.addListener(
      (details) => {
        if (!details.isProxy || !config.username || !config.password) {
          return { };
        }
        return {
          authCredentials: {
            username: config.username,
            password: config.password,
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
    handleInit(message);
  } else {
    // after the init message the only other messages are status messages
    console.log(message);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
