let config: ProxyScriptConfig | undefined;

async function log(...args: any[]) {
  await browser.runtime.sendMessage({ type: 'LOG', payload: args });
}

function handleRequest(url: string, host: string) {
  if (config === undefined) {
    return 'HTTP localhost';
  }
  if (config.isEnabled === false || config.bypassList.indexOf(host) !== -1) {
    return 'DIRECT';
  }
  const server = config.server;
  if (server === null) {
    throw new Error('Server is null');
  }
  return `HTTPS ${server.dns}:${server.port}`;
}

function FindProxyForURL(url: string, host: string) {
  log('Config', undefined);
  log('Checking request', url);
  const result = handleRequest(url, host);
  log('Request result for URL', url, result);
  return result;
}

function isProxyScriptMessageOfType<T extends ProxyScriptMessageType>(
  message: ProxyScriptMessage<ProxyScriptMessageType>,
  type: T,
): message is ProxyScriptMessage<T> {
  return message.type === type;
}

async function messageHandler(
  message: ProxyScriptMessage<ProxyScriptMessageType>,
) {
  if (isProxyScriptMessageOfType(message, 'SET_CONFIG')) {
    config = message.payload;
  } else if (isProxyScriptMessageOfType(message, 'PATCH_CONFIG')) {
    config = {
      ...config!,
      ...message.payload,
    };
  }
  await log('Handled message:', message);
}
browser.runtime.onMessage.addListener(messageHandler);
browser.runtime.sendMessage({ type: 'INIT', payload: undefined });
