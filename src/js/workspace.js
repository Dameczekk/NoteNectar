const formatText0 = document.querySelector('#formatText0');
const formatText1 = document.querySelector('#formatText1');
const formatText2 = document.querySelector('#formatText2');
const formatText3 = document.querySelector('#formatText3');
const formatText4 = document.querySelector('#formatText4');
const formatText5 = document.querySelector('#formatText5');

const formatAlign0 = document.querySelector('#formatAlign0');
const formatAlign1 = document.querySelector('#formatAlign1');
const formatAlign2 = document.querySelector('#formatAlign2');
const formatAlign3 = document.querySelector('#formatAlign3');

function boldText() {
  document.execCommand('bold', false, null);
}

function italicText() {
  document.execCommand('italic', false, null);
}

const alignTextLeft = () => {
  document.execCommand('justifyLeft', false, null);
  updateAlignmentButtons();
}

const alignTextCenter = () => {
  document.execCommand('justifyCenter', false, null);
  updateAlignmentButtons();
}

const alignTextRight = () => {
  document.execCommand('justifyRight', false, null);
  updateAlignmentButtons();
}

const alignTextJustify = () => {
  document.execCommand('justifyFull', false, null);
  updateAlignmentButtons();
}

function underlineText() {
  let selection = window.getSelection();
  let selectedText = selection.toString();
  let span = document.createElement('span');
  span.style.textDecoration = 'underline';
  
  if (selection.anchorNode.parentNode.style.textDecoration == 'underline') {
    span.style.textDecoration = 'none';
  }

  let range = selection.getRangeAt(0);
  range.surroundContents(span);
}

function createList() {
  document.execCommand('insertUnorderedList', false, null);
}

function updateActiveButtonState() {
  const activeFormats = {
    bold: false,
    italic: false,
    underline: false
  };

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;

    activeFormats.bold = document.queryCommandState('bold') || parentElement.style.fontWeight == 'bold';
    activeFormats.italic = document.queryCommandState('italic') || parentElement.style.fontStyle == 'italic';
    activeFormats.underline = document.queryCommandState('underline') || parentElement.style.textDecoration == 'underline';
  }

  if (activeFormats.bold) {
    formatText1.classList.add('activeFormat');
  } else {
    formatText1.classList.remove('activeFormat');
  }

  if (activeFormats.italic) {
    formatText0.classList.add('activeFormat');
  } else {
    formatText0.classList.remove('activeFormat');
  }

  if (activeFormats.underline) {
    formatText2.classList.add('activeFormat');
  } else {
    formatText2.classList.remove('activeFormat');
  }
}

const updateAlignmentButtons = () => {
  const alignButtons = [formatAlign0, formatAlign1, formatAlign2, formatAlign3];
  alignButtons.forEach(button => {
    button.classList.remove('activeFormat');
  });

  const alignment = document.queryCommandValue('justify');
  switch (alignment) {
    case 'left':
      formatAlign0.classList.add('activeFormat');
      break;
    case 'center':
      formatAlign1.classList.add('activeFormat');
      break;
    case 'right':
      formatAlign2.classList.add('activeFormat');
      break;
    case 'justify':
      formatAlign3.classList.add('activeFormat');
      break;
    default:
      break;
  }
}

formatText0.addEventListener('click', () => {
  italicText();
  updateActiveButtonState();
});

formatText1.addEventListener('click', () => {
  boldText();
  updateActiveButtonState();
});

formatText2.addEventListener('click', () => {
  underlineText();
  updateActiveButtonState();
});

formatText4.addEventListener('click', () => {
  createList();
  updateActiveButtonState();
});

document.addEventListener('selectionchange', updateActiveButtonState);
formatAlign0.addEventListener('click', alignTextLeft);
formatAlign1.addEventListener('click', alignTextCenter);
formatAlign2.addEventListener('click', alignTextRight);
formatAlign3.addEventListener('click', alignTextJustify);