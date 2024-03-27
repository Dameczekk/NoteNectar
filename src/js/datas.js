const getUserDataFromCookie = (cookieName, defaultValue) => {
  const cookieData = getCookie(cookieName);
  return cookieData ? JSON.parse(cookieData) : defaultValue;
};

const userData = getUserDataFromCookie('noten_userData', {
  usernames: [],
  passwords: [],
  codes: [],
  dates: [],
  pics: [],
  panelRunnable: false,
  accountIndex: -1
});

const foldersData = getUserDataFromCookie('noten_foldersData', {
  names: ['root'],
  ids: ['folder0']
});

const setCookie = (name, value, path = '/') => {
  document.cookie = name + "=" + value + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=" + path
}

const deleteCookie = (name) => { document.cookie = name + '=; Max-Age=-99999999;' }

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for(let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) == 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

const userDataReload = () => {
  setCookie('noten_userData', JSON.stringify(userData));
  setCookie('noten_foldersData', JSON.stringify(foldersData));
};

const createNewAccount = () => {
  const loginModal1 = document.querySelector('.loginModal1');
  const usernameInput = loginModal1.querySelector('.usernameInput')
  const passwordInput = loginModal1.querySelector('.passwordInput')
  const codeInput = loginModal1.querySelector('.codeInput')
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  userData.usernames.push(usernameInput.value);
  userData.passwords.push(passwordInput.value);
  userData.codes.push(codeInput.value);
  userData.pics.push(`assets/img/avatars/person${currentImageIndex}`);
  userData.dates.push(`${day}.${month}.${year}`);

  userDataReload();
}

const saveFolder = (name  = false) => {
  const nameInput = document.querySelector('.modal1 .nameInput');

  name == false ? foldersData.names.push(nameInput.value) : foldersData.names.push(name);
  foldersData.ids.push(`folder${folderId}`);

  userDataReload();
}

const loadData = () => {
  const accountPics = document.querySelectorAll('.accountPics');
  const accountUsernames = document.querySelectorAll('.accountUsernames');

  accountPics.forEach((element) => element.setAttribute('src', `${userData.pics[userData.accountIndex]}.png`));
  accountUsernames.forEach((element) => element.textContent = userData.usernames[userData.accountIndex]);


  for (let i = 0; i < foldersData.ids.length; i++) {
    if (i == 0) {
      createFolder(foldersData.names[i], true, true, 'folder', true, true);
    } else {
      createFolder(foldersData.names[i], false, false, 'subfolder', false, true);
    }
  }

  userDataReload();
}
