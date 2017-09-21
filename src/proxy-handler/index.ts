const proxyScriptURL = 'proxy-script/index.js';

browser.proxy.register(proxyScriptURL);

browser.proxy.onProxyError.addListener(error => {
  console.error(`[ProxyScript] [ERROR]: ${error.message}`);
});

async function initializeProxy() {
  const state = (await browser.storage.local.get()) as State;
  const { isEnabled, bypassList, serverId, serverList } = state;
  const server = serverId === null ? null : serverList[serverId];
  const message: ProxyScriptMessage<'SET_CONFIG'> = {
    type: 'SET_CONFIG',
    payload: {
      isEnabled: isEnabled,
      bypassList: bypassList,
      server,
    },
  };
  return browser.runtime.sendMessage(message, { toProxyScript: true });
}

function isKeyOfProxyConfig(key: string): key is keyof ProxyScriptConfig {
  return key === 'bypassList' || key === 'isEnabled' || key === 'proxy';
}

function isProxyHandlerMessageOfType<T extends ProxyHandlerMessageType>(
  message: ProxyHandlerMessage<ProxyHandlerMessageType>,
  type: T,
): message is ProxyHandlerMessage<T> {
  return message.type === type;
}

async function handleMessage(
  message: ProxyHandlerMessage<ProxyHandlerMessageType>,
  sender: { url: string },
) {
  // only handle messages from the proxy script
  if (sender.url === browser.extension.getURL(proxyScriptURL)) {
    if (isProxyHandlerMessageOfType(message, 'INIT')) {
      // Listen for proxy authentication request
      browser.webRequest.onAuthRequired.addListener(
        async details => {
          if (!details.isProxy) {
            return {};
          }
          const authCredentials = await browser.storage.local.get([
            'username',
            'password',
          ]);
          return { authCredentials };
        },
        {
          urls: ['<all_urls>'],
        },
        ['blocking'],
      );

      await initializeProxy();

      // Watch changes and inform proxy script
      browser.storage.onChanged.addListener(changes => {
        let patch: (ProxyScriptMessage<'PATCH_CONFIG'>)['payload'] = {};
        Object.keys(changes).forEach(key => {
          if (isKeyOfProxyConfig(key)) {
            patch[key] = changes[key].newValue;
          }
        });
        const message: ProxyScriptMessage<'PATCH_CONFIG'> = {
          type: 'PATCH_CONFIG',
          payload: patch,
        };
        browser.runtime.sendMessage(message, { toProxyScript: true });
      });
    } else if (isProxyHandlerMessageOfType(message, 'LOG')) {
      console.log(
        '[ProxyScript] Message from proxy script:',
        ...message.payload,
      );
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
