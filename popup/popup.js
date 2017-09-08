async function isLoggedIn() {
  const { isLoggedIn } = await browser.storage.local.get('isLoggedIn');
  return isLoggedIn;
}

async function isDisabled() {
  const { isDisabled } = await browser.storage.local.get('isDiabled');
  return isDisabled;
}

async function isServerSelected() {
  const { serverKey, serverList } = await browser.storage.local.get(['serverKey', 'serverList']);
  return serverKey && serverList[serverKey];
}

async function main() {
  const [loggedIn, disabled, serverSelected] = await Promise.all([
    isLoggedIn(), isDisabled(), isServerSelected()
  ]);

  if (!loggedIn) {
    window.location.href = './login.html';
  } else if (!isServerSelected) {
    window.location.href = './serverlist.html';
  } else {
    window.location.href = './loggedIn.html';
  }
}

main();