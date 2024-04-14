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
const dashboardButton = document.querySelector('#dashboardButton');
const toggleArrowButton = document.querySelector('#toggleArrowButton');
const allTools = document.querySelectorAll('.tool');
const tools = document.querySelector('.tools');
const back = document.querySelectorAll('.back');
const selectedBackground = document.querySelector('.selectedBackgroundColor');
const selectedText = document.querySelector('.selectedTextColor');
const downloadButton = document.querySelector('#downloadButton');
const deleteButton = document.querySelector('#deleteButton');
const settingsButton = document.querySelector('#settingsButton');
const archivesButton = document.querySelector('#archivesButton');
const noteContextEdit = document.querySelector('.noteContext #edit');
const noteContextView = document.querySelector('.noteContext #view');
const noteContextDelete = document.querySelector('.noteContext #delete');
const allBackgroundColors = document.querySelectorAll('.backgroundColor');
const allTextColors = document.querySelectorAll('.textColor');
const folderContextDelete = document.querySelector('.folderContext #delete');

let folderId = 0;
let noteId = 0;
let activeFolder = 0;
let activeNote = null;
let isLeftArrow = true;
let selectedFolder = 'folderContainer0';
let selectedBackgroundColor = 0;
let selectedTextColor = 0;

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
            if (element != document.querySelector('.modal0 .nameInput')) {
              element.value = '';
            } else {
              element.value = 'New note';
            }
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
  foldersData = {};
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
  const folderContext = document.querySelector('.folderContext');

  folder.setAttribute('id', `folder${folderId}`)

  name == false ? folder.textContent = nameInput.value : folder.textContent = name;

  if (name != false || nameInput.value != '') {
    folders.appendChild(element);
    name == false ? toggleModal(1, false, true, true) : '';
  } else {
    nameInput.classList.add('highlighted');
  }
  
  active == true ? folder.classList.add('activeFolderButton') : '';

  const openFolder = () => {
    activeFolder = parseInt(folder.getAttribute('id').split('folder')[1]);

    const allFolders = document.querySelectorAll('.folder');
    const allContainers = document.querySelectorAll('.folderContainer');
    const folderContainer = document.querySelector(`#folderContainer${activeFolder}`);

    allFolders.forEach(element => element.classList.remove('activeFolderButton'));
    allContainers.forEach(element => element.classList.remove('activeFolderContainer'));
    folder.classList.add('activeFolderButton');
    folderContainer.classList.add('activeFolderContainer');
  }

  folder.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    folderContext.style.animation = 'openModal 0.3s forwards';
    folderContext.style.left = `${e.clientX + 100}px`;
    folderContext.style.top = `${e.clientY - 50}px`;
    folderContext.style.display = 'block';
  });

  document.addEventListener('click', () => {
    folderContext.style.animation = 'closeModal 0.3s forwards';
    setTimeout(() => folderContext.style.display = 'none', 300);
  });

  folder.addEventListener('click', openFolder);
  folderContextDelete.addEventListener('click', deleteFolder);
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

      if (selectedFolder != 'previewQuickNotes') {
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

  numbersNotes.push(0);

  folderId++;
}

const deleteFolder = () => {

}

const createNoteThumbnail = () => {
  const noteThumbnail = document.createElement('div');
  const h2 = document.createElement('h2');
  const textarea = document.createElement('textarea');
  const container = document.querySelector(`#${selectedFolder} .container`);
  const nameInput = document.querySelector('.modal0 .nameInput');
  const noteContext = document.querySelector('.noteContext');

  noteThumbnail.classList.add('noteThumbnail');

  nameInput.value == '' ? h2.textContent = 'New note' : h2.textContent = nameInput.value;

  textarea.classList.add('noteText');
  textarea.setAttribute('readonly', '');

  noteThumbnail.appendChild(h2);
  noteThumbnail.appendChild(textarea);
  noteThumbnail.setAttribute('id', `noteThumbnail${noteId}`);

  container.appendChild(noteThumbnail);
  activeNote = parseInt(noteThumbnail.getAttribute('id').split('noteThumbnail')[1]);

  noteThumbnail.addEventListener('click', () => {
    activeNote = parseInt(noteThumbnail.getAttribute('id').split('noteThumbnail')[1]);
    loadWorkspace();
  });

  noteThumbnail.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    noteContext.style.animation = 'openModal 0.3s forwards';
    noteContext.style.left = `${e.clientX + 100}px`;
    noteContext.style.top = `${e.clientY - 100}px`;
    noteContext.style.display = 'block';

    activeNote = parseInt(noteThumbnail.getAttribute('id').split('noteThumbnail')[1]);
  });

  document.addEventListener('click', () => {
    noteContext.style.animation = 'closeModal 0.3s forwards';
    setTimeout(() => noteContext.style.display = 'none', 300);
  });

  const searchInput = document.querySelector('#searchInput');

  searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();

    const titleText = h2.textContent.toLowerCase();

    if (titleText.includes(searchText)) {
      noteThumbnail.classList.remove('hidden');
    } else {
      noteThumbnail.classList.add('hidden');
    }
  });
}

const createNoteWorkspace = () => {
  const workspacePattern = document.querySelector('.workspacePattern');
  const section1 = document.querySelector('.section1');
  const element = workspacePattern.content.cloneNode(true);
  const workspace = element.querySelector('.workspace');
  const nameInput = document.querySelector('.modal0 .nameInput');
  const path = element.querySelector('.path');
  const lastEdit = element.querySelector('.lastEdit');
  const author = element.querySelector('.author');
  const folderContainer = document.querySelector(`#${selectedFolder}`);
  const folderId = folderContainer.id.split('folderContainer')[1];
  const folderElement = document.querySelector(`#folder${folderId}`);
  const noteArea = element.querySelector('.noteArea');
  const noteName = element.querySelector('.noteName');

  noteName.value = nameInput.value;
  if (selectedFolder != 'quickNotes') {
    path.textContent = `${folderElement.textContent}/${nameInput.value}`;
  }
  author.textContent = `Author: ${userData.usernames[userData.accountIndex]}`;
  workspace.setAttribute('id', `noteWorkspace${noteId}`);

  section1.appendChild(element);

  noteName.addEventListener('input', () => {
    const h2 = document.querySelector(`#noteThumbnail${activeNote} h2`);
    const path = document.querySelector(`#noteWorkspace${activeNote} .path`);
    const folderName = document.querySelector(`#folder${activeFolder}`).textContent;

    path.textContent = `${folderName}/${noteName.value}`;
    h2.textContent = noteName.value;
  });

  noteArea.addEventListener('input', moveToTextArea);
}

const createNote = () => {
  let selectedFolderInt = parseInt(selectedFolder.split('folderContainer')[1]);
  const h2 = document.querySelector(`#${selectedFolder} h2`);

  createNoteThumbnail();
  createNoteWorkspace();

  noteId++;

  numbersNotes[selectedFolderInt]++;

  if (numbersNotes[selectedFolderInt] == 0) {
    h2.textContent = 'Nothing here yet';
  } else {
    h2.textContent = '';
  }
}

const switchSection = (number) => {
  const allSections = document.querySelectorAll('section');
  const section = document.querySelector(`.section${number}`);
  const toolBar = document.querySelector('.toolBar');
  const allNoteWorkspaces = document.querySelectorAll('.workspace');

  allSections.forEach(element => element.classList.add('hidden'));
  section.classList.remove('hidden');

  if (number == 0 && !toolBar.classList.contains('toolBarHidden')) {
    toggleToolbar();
    toggleWorkspaceButtons();

    allNoteWorkspaces.forEach(element => {
      element.classList.add('hidden');
    });
  }
}

const toggleToolbar = () => {
  const toolBar = document.querySelector('.toolBar');
  const section1 = document.querySelector('.section1');

  toolBar.classList.toggle('toolBarHidden');
  setTimeout(() => {
    section1.classList.toggle('section1Animation');
  }, 100);
}

const toggleWorkspaceButtons = () => {
  const workspaceButtons = document.querySelector('.workspaceButtons');

  workspaceButtons.classList.toggle('workspaceButtonsHidden');
}

const loadWorkspace = (action = false) => {
  const noteWorkspace = document.querySelector(`#noteWorkspace${activeNote}`);

  action != 'view' ? toggleToolbar() : '';

  toggleWorkspaceButtons()
  switchSection(1);

  noteWorkspace.classList.remove('hidden');
}

function switchArea(index) {
  if (allTools[index] && allTools[index].style.transform == 'translateX(0px)') {
    allTools[index].style.transform = 'translateX(300px)';
    tools.style.transform = 'translateX(0px)';
  } else if (allTools[index]) {
    allTools[index].style.transform = 'translateX(0px)';
    tools.style.transform = 'translateX(-300px)';
  }
}

allTools.forEach((element, i) => {
  const button = tools.querySelectorAll('button');
  button ? button[i].addEventListener('click', () => switchArea(i)) : '';
});

const resetToInitialState = () => {
  const toolBar = document.querySelector('.toolBar');

  tools.style.transform = 'translateX(0px)';
  allTools.forEach((element) => toolBar ? element.style.transform = 'translateX(300px)' : '')
}

back.forEach((element) => element.addEventListener('click', () => resetToInitialState()));

allBackgroundColors.forEach((colorItem, index) => {
  colorItem.addEventListener('click', () => {
    const parent = selectedBackground.parentElement;

    const borderColor = window.getComputedStyle(colorItem).borderColor;
    const backgroundColor = window.getComputedStyle(colorItem).backgroundColor;

    const thumbnail = document.querySelector(`#noteThumbnail${activeNote}`);
    const noteContainer = document.querySelector(`#noteWorkspace${activeNote} .noteContainer`);
    const noteArea = document.querySelector(`#noteWorkspace${activeNote} .noteArea`);

    selectedBackground.style.backgroundColor = borderColor;

    parent.removeChild(selectedBackground);
    colorItem.appendChild(selectedBackground);

    const id = colorItem.id;
    selectedBackgroundColor = parseInt(id.replace('backgroundColor', ''));

    noteContainer.style.backgroundColor = backgroundColor;
    noteContainer.style.borderColor = borderColor;
    noteArea.style.backgroundColor = backgroundColor;
    noteArea.style.borderColor = borderColor;

    thumbnail.style.backgroundColor = backgroundColor;
    thumbnail.style.borderColor = borderColor;
  });
});

allTextColors.forEach((colorItem, index) => {
  colorItem.addEventListener('click', () => {
    const parent = selectedText.parentElement;
    const borderColor = window.getComputedStyle(colorItem).borderColor;
    const backgroundColor = window.getComputedStyle(colorItem).backgroundColor;
    const noteArea = document.querySelector(`#noteWorkspace${activeNote} .noteArea`);

    selectedText.style.backgroundColor = borderColor;

    parent.removeChild(selectedText);
    colorItem.appendChild(selectedText);

    const id = colorItem.id;
    selectedTextColor = parseInt(id.replace('textColor', ''));

    noteArea.style.color = backgroundColor;
  })
});

const moveToTextArea = () => {
  let divText = document.querySelector(`#noteWorkspace${activeNote} .noteArea`).innerText;
  document.querySelector(`#noteThumbnail${activeNote} .noteText`).value = divText;
}

const downloadNote = () => {
  let textToDownload = document.querySelector(`#noteWorkspace${activeNote} .noteArea`).innerText;
  let blob = new Blob([textToDownload], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  
  let noteName = document.querySelector(`#noteWorkspace${activeNote} .noteName`).value;
  let fileName = noteName + '.txt';
            
  let a = document.querySelector('#downloadButton');
  a.setAttribute('download', fileName);
  a.href = url;
}

const noteAvailability = () => {
  const folderH2 = document.querySelector(`#folderContainer${activeFolder} h2`);

  numbersNotes[activeFolder] >= 1 
  ? folderH2.textContent = 'Your notes'
  : folderH2.textContent = 'Nothing here yet!';
}

const buttonSwitch = document.querySelector('.switch');

const darkTheme = () => {
  const switchElements = document.querySelector('.switchElements');
  const switchElement = buttonSwitch.querySelector('.switchElement');
  const switchText = switchElements.querySelector('span');

  if (userData.darkTheme[userData.accountIndex]) {
    switchText.textContent = 'Dark theme (enabled)'
    manageTheme('dark');
    switchElement.classList.add('activeSwitchElement');
    buttonSwitch.classList.add('activeSwitch');
  } else {
    switchText.textContent = 'Dark theme (disabled)';
    manageTheme(null, 'delete');
    switchElement.classList.remove('activeSwitchElement');
    buttonSwitch.classList.remove('activeSwitch');
  }

  userDataReload();
}

buttonSwitch.addEventListener('click', () => {
  userData.darkTheme[userData.accountIndex] = !userData.darkTheme[userData.accountIndex];
  darkTheme();
});

const manageTheme = (file, action = 'add') => {
  manageStartScreen('show');
  setTimeout(() => {
    manageStartScreen('hidden');
  }, 1000);

  setTimeout(() => {
    let existingThemeStyle = document.getElementById('theme-style');
    if (existingThemeStyle && action == 'delete') {
      existingThemeStyle.parentNode.removeChild(existingThemeStyle);
    }

    if (file && file.trim() != '') {
      const fileName = file.includes('/') ? file : `src/css/themes/${file}.css`;

      let themeStyle = document.createElement('link');
      themeStyle.setAttribute('rel', 'stylesheet');
      themeStyle.setAttribute('type', 'text/css');
      themeStyle.setAttribute('href', fileName);
      themeStyle.setAttribute('id', 'theme-style');

      document.head.appendChild(themeStyle);
    }
  }, 300);
}

allCancels.forEach((element, i) => element.addEventListener('click', () => {
  if (i == 0 || i == 1) {
    toggleModal(i, false, true, true);
  } else {
    toggleModal(i);
  }
}));

allConfirms.forEach((element, i) => element.addEventListener('click', () => {
  if (i == 0) {
    createNote();
    loadWorkspace();
    toggleModal(i, false, true, true);
  } else if (i == 1) {
    createFolder(false, false, false, 'subfolder');
  } else if (i == 2) {
    deleteNote();
  } {
    toggleModal(i);
  }
}));

toggleArrowButton.addEventListener('click', () => {
  toggleToolbar();

  if (isLeftArrow) {
    toggleArrowButton.querySelector('img').setAttribute('src', 'assets/img/icons/right.svg');
    isLeftArrow = false;
  } else {
    toggleArrowButton.querySelector('img').setAttribute('src', 'assets/img/icons/left.svg');
    isLeftArrow = true;
  }
});

noteContextDelete.addEventListener('click', () => toggleModal(2));
noteContextView.addEventListener('click', () => loadWorkspace('view'));
noteContextEdit.addEventListener('click', loadWorkspace);
archivesButton.addEventListener('click', () => switchSection(2));
settingsButton.addEventListener('click', () => toggleModal(3));
deleteButton.addEventListener('click', () => toggleModal(2));
downloadButton.addEventListener('click', () => downloadNote());
dashboardButton.addEventListener('click', () => switchSection(0));
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
