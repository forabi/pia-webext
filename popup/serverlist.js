const container = document.querySelector('.container');

const SERVER_LIST_URL = 'https://www.privateinternetaccess.com/api/client/services/https';

async function displayServerList() {
  const fragment = document.createDocumentFragment();
  const response = await fetch(SERVER_LIST_URL, {
    credentials: 'include',
  });

  const serverList = await response.json();

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
    radioButton.name = 'server';
    
    li.appendChild(flag);
    li.appendChild(label);
    li.appendChild(radioButton);
    fragment.appendChild(li);
  });

  container.appendChild(fragment);
}

displayServerList();