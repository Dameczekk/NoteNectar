const main = () => {
  setTimeout(() => {
    if (userData.panelRunnable == true) {
      launchPanel();
    } else {
      loadLongElements();
      toggleModal(0, 'login');
    }
  }, 500);
}

let currentImageIndex = 0;

const loadLongElements = () => {
  const profilePics = document.querySelector('.loginModal1 .profilePics');

  Array.from({ length: 15 }).forEach((_, i) => {
    const element = document.createElement('div');
    const element__Img = document.createElement('img');

    element.classList.add('sliderItem');

    element__Img.src = `assets/img/avatars/person${i}.png`;
    element__Img.alt = `Person ${i}`;

    profilePics.appendChild(element);
    element.appendChild(element__Img);
  });
};

const manageStartScreen = (action) => {
  const startScreen = document.querySelector('.startScreen');

  if (action == 'show') {
    startScreen.classList.remove('hidden')
    setTimeout(() => startScreen.style.opacity = 1, 30);
  } else if (action == 'hidden') {
    startScreen.style.opacity = 0;
    setTimeout(() => startScreen.classList.add('hidden'), 300);
  }
}

const noteNames = [
  "Blue Dog Note",
  "Green Elephant Note",
  "Red Tiger Note",
  "Yellow Giraffe Note",
  "Orange Banana Note",
  "Black Lion Note",
  "Gray Apple Note",
  "Purple Monkey Note",
  "White Carrot Note",
  "Pink Cat Note",
];

const launchPanel = () => {
  manageStartScreen('hidden');
  loadData();
  toggleModal(3);

  for (let i = 0; i < 100; i++) {
    document.querySelector('.modal0 .nameInput').value = noteNames[Math.floor(Math.random()*noteNames.length)];
    const noteThumbnails = document.querySelectorAll('.noteThumbnail');

  noteThumbnails.forEach(thumbnail => {
    thumbnail.style.background = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  });
    createNote();
  }
}

window.addEventListener('DOMContentLoaded', main);