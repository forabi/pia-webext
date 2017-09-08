browser.storage.onChanged.addListener(async () => {
  const { serverKey, serverList, isLoggedIn, isDisabled } = await browser.storage.local.get(['isLoggedIn', 'serverKey', 'serverList', 'isDisabled']);
  if (!isDisabled && serverKey && serverList[serverKey]) {
    browser.browserAction.setTitle({ title: `Connected to ${serverList[serverKey].name}` });
    browser.browserAction.setBadgeText({ text: serverList[serverKey].iso });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16.png',
        32: '/images/icons/icon32.png',
      }
    });
  } else {
    browser.browserAction.setBadgeText({ text: '' });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16red.png',
        32: '/images/icons/icon32red.png',
      }
    });
    if (isLoggedIn) {
      browser.browserAction.setTitle({ title: 'Logged in but not connected' });
    } else {
      browser.browserAction.setTitle({ title: 'Not connected' });
    }
  }
});