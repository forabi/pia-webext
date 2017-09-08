// const bypassListTextArea = (document.querySelector("#bypass-list"));
const usernameInput = (document.querySelector("input[name='username']"));
const passwordInput = (document.querySelector("input[name='password']"));
const submitButton = /** @type {HTMLInputElement} */ (document.querySelector("button[type='submit']"));

const form = /** @type {HTMLFormElement} */(document.querySelector('#form-login'));
const AUTH_URL = 'https://www.privateinternetaccess.com/api/client/auth';

form.addEventListener('submit', async e => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.classList.add('loading');
  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  console.log(username, password);
  const response = await fetch(
    AUTH_URL,
    {
      credentials: 'include',
      headers: new Headers({
        Authorization: `Basic ${btoa(unescape(encodeURIComponent(`${username}:${password}`)))}`
      }),
    }
  );
  console.log('PIA response', response);
  submitButton.disabled = false;
  submitButton.classList.remove('loading');
});

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  // const bypassList = bypassListTextArea.value.split("\n");
  const username = usernameInput.value;
  const password = passwordInput.value;
  return browser.storage.local.set({
    // bypassList,
    username,
    password,
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  // bypassListTextArea.value = restoredSettings.bypassList.join("\n");
  console.log(restoredSettings);
  usernameInput.value = restoredSettings.username || '';
  passwordInput.value = restoredSettings.password || '';
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get(['password', 'username']).then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
// bypassListTextArea.addEventListener("change", storeSettings);
usernameInput.addEventListener("change", storeSettings);
passwordInput.addEventListener("change", storeSettings);


