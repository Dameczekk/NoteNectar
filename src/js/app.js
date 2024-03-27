const logoutButton = document.querySelector('#logoutButton');
const checkLoginButton = document.querySelector('#checkLogin');
const signupRedirect = document.querySelector('#signupRedirect');
const signupCancel = document.querySelector('.signupCancel');
const signupConfirm = document.querySelector('.signupConfirm');
const arrowBack = document.querySelector('.loginModal1 .arrowBack');
const arrowForward = document.querySelector('.loginModal1 .arrowForward');
const sliderContainer = document.querySelector('.loginModal1 .profilePics');
const rememberInput = document.querySelector('.rememberInput');
const addNoteButton = document.querySelector('#addNoteButton');
const allCancels = document.querySelectorAll('.cancel');
const allConfirms = document.querySelectorAll('.confirm');
const addFolderButton = document.querySelector('#addFolderButton');

let folderId = 0;
let activeFolder = null;
let selectedFolder = 'folderContainer0';

const toggleOverlay = () => {
  const overlay = document.querySelector('.overlay');

  if (overlay) {
    if (overlay.classList.contains('hidden')) {
      overlay.classList.remove('hidden');
      setTimeout(() => overlay.classList.add('animationOverlay'), 50);
    } else {
      overlay.classList.remove('animationOverlay');
      setTimeout(() => overlay.classList.add('hidden'), 500);
    }
  }
}

const toggleModal = (number, other = false, overlayEnabled = true, clear = false) => {
  let modal = null;
  if (other == false) {
    modal = document.querySelector(`.modal${number}`);
  } else {
    modal = document.querySelector(`.${other}Modal${number}`);
  }

  if (modal) {
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      modal.style.animation = 'var(--openModal)';
        setTimeout(() => {
      }, 50);
    } else {
      modal.style.animation = 'var(--closeModal)';
      setTimeout(() => {
        modal.classList.add('hidden');
        if (clear) {
          const inputs = modal.querySelectorAll('input');
      
          if (number == 1 && other == 'login') {
            currentImageIndex = 0;
            sliderContainer.style.transform = 'translateX(0px)';
          }
          
          if (number == 0 && other == 'login' 
          || number == 1 && other == 'login') {
            modal.querySelector('.alert').textContent = '';
          }
          inputs.forEach(element => {
            element.value = '';
            element.classList.remove('highlighted');
          });
        }
      }, 500);
    }
  }
  overlayEnabled ? toggleOverlay() : '';
}

const logOut = () => {
  userData.panelRunnable = false;
  userDataReload();
  window.location.reload();
}

const checkLogin = () => {
  const passwordInput = document.querySelector('.loginModal0 .passwordInput');
  const usernameInput = document.querySelector('.loginModal0 .usernameInput');
  const alert = document.querySelector('.loginModal0 .alert');

  if (usernameInput.value == '' || passwordInput.value == '') {
    alert.textContent = 'Fill in all fields';
  } else if (userData.usernames.includes(usernameInput.value)) {
    userData.accountIndex = userData.usernames.indexOf(usernameInput.value);
    alert.textContent = '';
    if (passwordInput.value == userData.passwords[userData.accountIndex]) {
      alert.textContent = 'Logged in'
      toggleModal(0, 'login');
      setTimeout(() => {
        launchPanel();
      }, 5000);
    } else {
      alert.textContent = 'Password is incorrect';
    }
  } else {
    alert.textContent = 'Account not found';
  }
}

const navigateSlider = (direction) => {
  currentImageIndex = (currentImageIndex + direction + sliderContainer.childElementCount) % sliderContainer.childElementCount;
  updateSlider();
}

const updateSlider = () => {
  const translateXValue = -currentImageIndex * 142;
  sliderContainer.style.transform = `translateX(${translateXValue}px)`;
}

const rememberMe = () => {
  rememberInput.checked ? userData.panelRunnable = true : userData.panelRunnable = false;
  userDataReload();
}

const checkPassword = (password) =>  {
  const requires = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*(?=.*\d).*(?=.*[A-Z]).*$/;
  const requireLength = password.length >= 8 && password.length <= 16;
  return requires.test(password) && requireLength;
}

const checkSignup = () => {
  const loginModal1 = document.querySelector('.loginModal1');
  const alert = loginModal1.querySelector('.alert');
  const usernameInput = loginModal1.querySelector('.usernameInput');
  const passwordInput = loginModal1.querySelector('.passwordInput');
  const confirmPasswordInput = loginModal1.querySelector('.confirmPasswordInput');
  const codeInput = loginModal1.querySelector('.codeInput');

  if (usernameInput.value == '' ||
      passwordInput.value == '' ||
      confirmPasswordInput.value == '' ||
      codeInput.value == ''
      ) {
    alert.textContent = 'Fill in all fields';
  } else if (userData.usernames.includes(usernameInput.value)) {
    alert.textContent = 'This username is not available';
  } else if (!checkPassword(passwordInput.value)) {
    alert.textContent = 'The password must be 8 to 16 characters long, contain at least one special character, and at least one digit';
  } else if (confirmPasswordInput.value != passwordInput.value) {
    alert.textContent = 'Passwords are not the same';
  } else if (codeInput.value.length != 8) {
    alert.textContent = 'The PIN must be 8 characters long';
  } else {
    createNewAccount();
    toggleModal(0, 'login');
    toggleModal(1, 'login');
    window.location.reload();
  }
}

const createFolderButton = (name = false, active = false) => {
  const nameInput = document.querySelector('.modal1 .nameInput');
  const folders = document.querySelector('#folders');
  const folderPattern = document.querySelector('.folderPattern');
  const element = folderPattern.content.cloneNode(true);
  const folder = element.querySelector('.folder');

  folder.setAttribute('id', `folder${folderId}`)

  name == false ? folder.textContent = nameInput.value : folder.textContent = name;

  if (name != false || nameInput.value != '') {
    folders.appendChild(element);
    name == false ? toggleModal(1, false, true, true) : '';
  } else {
    nameInput.classList.add('highlighted');
  }
  
  
  active == true ? folder.classList.add('activeFolderButton') : '';

  folder.addEventListener('click', () => {
    activeFolder = parseInt(folder.getAttribute('id').split('folder')[1]);

    const allFolders = document.querySelectorAll('.folder');
    const allContainers = document.querySelectorAll('.folderContainer');
    const folderContainer = document.querySelector(`#folderContainer${activeFolder}`);

    allFolders.forEach(element => element.classList.remove('activeFolderButton'));
    allContainers.forEach(element => element.classList.remove('activeFolderContainer'));
    folder.classList.add('activeFolderButton');
    folderContainer.classList.add('activeFolderContainer');
  });
}

const createFolderContainer = (active = false) => {
  const foldersContainers = document.querySelector('#foldersContainers');
  const folderContainerPattern = document.querySelector('.folderContainerPattern');
  const element = folderContainerPattern.content.cloneNode(true);
  const folderContainer = element.querySelector('.folderContainer');

  folderContainer.setAttribute('id', `folderContainer${folderId}`);

  active == true ? folderContainer.classList.add('activeFolderContainer') : '';

  foldersContainers.appendChild(element);
}

const createPreview = (type, name, active = false) => {
  const nameInput = document.querySelector('.modal1 .nameInput');

  if (type == 'folder') {
    const previewFolders = document.querySelector('#previewFolders');
    const previewFolderPattern = document.querySelector('.previewFolderPattern');
    const element = previewFolderPattern.content.cloneNode(true);
    const previewFolder = element.querySelector('.previewFolder');
    const span = previewFolder.querySelector('span');

    if (name == false) {
      span.textContent = nameInput.value;
    } else {
      span.textContent = name;
    }

    previewFolder.setAttribute('id', `previewFolder${folderId}`);

    if (active == true) {
      previewFolder.classList.add('activePreviewFolder');
    }

    previewFolders.appendChild(element);
  } else if (type == 'subfolder') {
    const subfolders = document.querySelector('#subfolders');
    const subfolderPattern = document.querySelector('.subfolderPattern');
    const element = subfolderPattern.content.cloneNode(true);
    const previewSubfolder = element.querySelector('.previewFolder');
    const span = previewSubfolder.querySelector('span');

    if (name == false) {
      span.textContent = nameInput.value;
    } else {
      span.textContent = name;
    }

    previewSubfolder.setAttribute('id', `previewFolder${folderId}`);

    subfolders.appendChild(element);

  }
  
  const previewFolders = document.querySelectorAll('.previewFolder');

  previewFolders.forEach(element => {
    element.addEventListener('click', () => {
      selectedFolder = element.getAttribute('id');

      if (selectedFolder != 'previewLastNotes') {
        selectedFolder = ('folderContainer' + element.getAttribute('id').split('previewFolder')[1]);
      } else {
        selectedFolder = ('l' + element.getAttribute('id').split('previewL')[1]);
      }

      const allFolders = document.querySelectorAll('.previewFolder');
  
      allFolders.forEach(element => element.classList.remove('activePreviewFolder'));
      element.classList.add('activePreviewFolder');
    });
  });
}

const createFolder = (name = false, buttonActive = false, containerActive = false, previewType, previewActive = false, render = false) => {
  render == false ? saveFolder(name) : '';

  createPreview(previewType, name, previewActive);
  createFolderButton(name, buttonActive);
  createFolderContainer(containerActive);

  folderId++;
}

const createNoteThumbnail = () => {
  const noteThumbnail = document.createElement('div');
  const h2 = document.createElement('h2');
  const textarea = document.createElement('textarea');
  const container = document.querySelector(`#${selectedFolder} .container`);
  const nameInput = document.querySelector('.modal0 .nameInput');

  noteThumbnail.classList.add('noteThumbnail');

  h2.textContent = nameInput.value;

  textarea.classList.add('noteText');
  textarea.setAttribute('readonly', '');

  noteThumbnail.appendChild(h2);
  noteThumbnail.appendChild(textarea);

  container.appendChild(noteThumbnail);
}

allCancels.forEach((element, i) => element.addEventListener('click', () => {
  if (i == 0 || i == 1) {
    toggleModal(i, false, true, true);
  } else{
    toggleModal(i);
  }
}));

allConfirms.forEach((element, i) => element.addEventListener('click', () => {

  if (i == 0) {
    createNoteThumbnail();
    toggleModal(i, false, true, true);
  } else if (i == 1) {
    createFolder(false, false, false, 'subfolder');
  } else {
    toggleModal(i);
  }
}));

addFolderButton.addEventListener('click', () => toggleModal(1, false, true, true));
addNoteButton.addEventListener('click', () => toggleModal(0, false, true, true));
rememberInput.addEventListener('change', rememberMe);
arrowBack.addEventListener('click', () => navigateSlider(-1));
arrowForward.addEventListener('click', () => navigateSlider(1));
signupCancel.addEventListener('click', () => toggleModal(1, 'login', false, true));
signupRedirect.addEventListener('click', () => toggleModal(1, 'login', false));
checkLoginButton.addEventListener('click', checkLogin);
logoutButton.addEventListener('click', logOut);
signupConfirm.addEventListener('click', () => checkSignup());
