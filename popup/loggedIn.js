const serverName = document.querySelector('#selected-server-name');
const checkbox = /** @type {HTMLInputElement} */ (document.querySelector('input[name="enabled"]'));
const flag = /** @type {HTMLImageElement} */ (document.querySelector('#flag'));

browser.storage.local.get(['serverKey', 'serverList', 'isDisabled']).then(({ serverKey, serverList, isDisabled }) => {
  const server = serverList[serverKey];
  serverName.textContent = server.name;
  flag.src = `/images/flags/${server.iso}_64.png`;
  flag.alt = server.iso;
  checkbox.checked = !isDisabled;
});

checkbox.addEventListener('input', async (ev) => {
  await browser.storage.local.set({ isDisabled: !checkbox.checked });
});
