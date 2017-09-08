const chooseServerForm = /** @type {HTMLFormElement} */ (document.querySelector('#form-choose-server'));
const chooseServerButton = /** @type {HTMLButtonElement} */ (chooseServerForm.querySelector('button[type="submit"]'));

chooseServerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(chooseServerForm);
  const serverKey = formData.get('server');
  await browser.storage.local.set({ serverKey, isDisabled: false });
  // @TODO: store server key
  window.location.href = './loggedIn.html';
})


const SERVER_LIST_URL = 'https://www.privateinternetaccess.com/api/client/services/https';

async function displayServerList() {
  const fragment = document.createDocumentFragment();
  const response = await fetch(SERVER_LIST_URL, {
    credentials: 'include',
  });

  const serverList = await response.json();
  await browser.storage.local.set({ serverList });

  Object.keys(serverList).forEach(key => {
    const server = serverList[key];

    const li = document.createElement('li');
    li.classList.add('server');

    const flag = document.createElement('img');
    flag.src = `/images/flags/${server.iso}_64.png`;
    flag.classList.add('flag');

    const label = document.createElement('label');
    label.textContent = server.name;
    label.htmlFor = key;
    label.classList.add('server-name');

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = key;
    radioButton.value = key;
    radioButton.name = 'server';
    radioButton.addEventListener('change', () => {
      chooseServerButton.click();
    });
    
    li.appendChild(flag);
    li.appendChild(label);
    li.appendChild(radioButton);
    fragment.appendChild(li);
  });

  chooseServerForm.insertBefore(fragment, chooseServerButton);
}

displayServerList();