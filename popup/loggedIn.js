const serverName = document.querySelector('#selected-server-name');

browser.storage.local.get('serverKey').then(({ serverKey }) => {
  serverName.textContent = serverKey;
})