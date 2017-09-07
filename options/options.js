const bypassListTextArea = document.querySelector("#bypass-list");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  const bypassList = bypassListTextArea.value.split("\n");
  const username = usernameInput.value;
  const password = passwordInput.value;
  return browser.storage.local.set({
    bypassList,
    username,
    password,
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  bypassListTextArea.value = restoredSettings.bypassList.join("\n");
  usernameInput.value = restoredSettings.username;
  passwordInput.value = restoredSettings.password;
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
bypassListTextArea.addEventListener("change", storeSettings);
usernameInput.addEventListener("change", storeSettings);
passwordInput.addEventListener("change", storeSettings);
