function getSelectedServer(state: State) {
  const { serverId, serverList } = state;
  return serverId !== null ? serverList[serverId] : null;
}

function isConnected(state: State) {
  const { serverId, isLoggedIn, isEnabled } = state;
  return serverId !== null && isLoggedIn === true && isEnabled === true;
}

async function updateIcon() {
  const state = await browser.storage.local.get() as State;
  const { isLoggedIn, isEnabled } = state;
  if (isConnected(state)) {
    const server = getSelectedServer(state)!;
    browser.browserAction.setTitle({ title: `Connected to ${server.name}` });
    browser.browserAction.setBadgeText({ text: server.iso });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16.png',
        32: '/images/icons/icon32.png',
      },
    });
  } else {
    browser.browserAction.setTitle({ title: 'Not connected' });
    browser.browserAction.setBadgeText({ text: '' });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16red.png',
        32: '/images/icons/icon32red.png',
      },
    });
  }
};


updateIcon().then(() => {
  browser.storage.onChanged.addListener(updateIcon);
});
