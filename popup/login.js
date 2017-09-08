// const bypassListTextArea = (document.querySelector("#bypass-list"));
const usernameInput = /** @type {HTMLInputElement} */ (document.querySelector("input[name='username']"));
const passwordInput = /** @type {HTMLInputElement} */ (document.querySelector("input[name='password']"));
const submitButton = /** @type {HTMLInputElement} */ (document.querySelector("button[type='submit']"));

const markAsValid = (e) => {
  e.target.setCustomValidity('');
};

usernameInput.addEventListener('input', markAsValid);
passwordInput.addEventListener('input', markAsValid);

const form = /** @type {HTMLFormElement} */(document.querySelector('#form-login'));
const AUTH_URL = 'https://www.privateinternetaccess.com/api/client/auth';

form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  console.log(username, password);
  submitButton.disabled = true;
  usernameInput.disabled = true;
  passwordInput.disabled = true;
  submitButton.classList.add('loading');
  try {
    const response = await fetch(
      AUTH_URL,
      {
        credentials: 'include',
        headers: new Headers({
          Authorization: `Basic ${btoa(unescape(encodeURIComponent(`${username}:${password}`)))}`
        }),
      }
    );
    if (response.status === 200) {
      await browser.storage.local.set({ isLoggedIn: true });
      console.log('PIA response', response);
      window.location.href = './serverlist.html';
    } else {
      await browser.storage.local.set({ isLoggedIn: false });
      usernameInput.setCustomValidity('Wrong password/username');
      passwordInput.setCustomValidity('Wrong password/username');
    }
  } catch (e) {
    // @TODO: Connection error
  }
  submitButton.disabled = false;
  usernameInput.disabled = false;
  passwordInput.disabled = false;
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
usernameInput.addEventListener("input", storeSettings);
passwordInput.addEventListener("input", storeSettings);


