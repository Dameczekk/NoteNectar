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

const launchPanel = () => {
  const startScreen = document.querySelector('.startScreen');

  startScreen.style.opacity = 0;
  setTimeout(() => startScreen.classList.add('hidden'), 300);

  loadData();
}

window.addEventListener('DOMContentLoaded', main);