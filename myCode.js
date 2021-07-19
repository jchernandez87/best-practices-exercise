//index.js
import _ from 'lodash';
import './style.css';
import { addTask, addBtn } from './modules/addTask.js';

addBtn.addEventListener('click', addTask);

//taks.js
const checkInput = document.getElementsByClassName('checkBox');

const checkClick = () => {
  for (let i = 0; i < checkInput.length; i++) {
    checkInput[i].addEventListener('click', () => {
      checkInput[i].parentElement.classList.toggle('completed');
      checkInput[i].parentElement.parentElement.classList.toggle('completed');
      checkInput[i].toggleAttribute('checked');
    });
  }
};

export { checkClick, checkInput };

//localStorage.js
import { checkInput } from './tasks.js';

const list = document.getElementsByClassName('row');

const updateArr = () => {
  const dataArr = [];
  for (let i = 0; i < list.length; i++) {
    dataArr.push({ description: list[i].textContent, completed: false, index: list[i].getAttribute('data-id') });
    if (checkInput[i].parentElement.classList.contains('completed')) {
      dataArr[i].completed = true;
    } else {
      dataArr[i].completed = false;
    }
    console.log(checkInput[i].parentNode);
  }
  return dataArr;
};

window.addEventListener('load', updateArr);

const updateData = () => {
  const data = JSON.stringify(updateArr());
  localStorage.setItem('tasks', data);
};

const getData = () => {
  let dataArr;
  if (localStorage.getItem('tasks') === null) {
    dataArr = [];
  } else {
    dataArr = JSON.parse(localStorage.getItem('tasks'));
  }
  return dataArr;
};

const saveData = (data) => {
  const dataArr = getData();
  dataArr.push(data);
  localStorage.setItem('data', JSON.stringify(dataArr));
};

export {
  updateArr, saveData, updateData, getData, list,
};

//drag.js
import { updateData, updateArr } from './localStorage.js';
import { checkClick } from './tasks.js';

let srcElement = null;

const drag = (item) => {
  item.addEventListener('dragstart', (e) => {
    srcElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.innerHTML);
    item.classList.add('dragging');
  });

  item.addEventListener('dragend', (e) => {
    e.preventDefault();
    item.classList.remove('dragging');
  });

  item.addEventListener('dragenter', () => {
    item.classList.add('over');
  });

  item.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  item.addEventListener('dragleave', () => {
    item.classList.remove('over');
  });

  item.addEventListener('drop', (e) => {
    e.stopPropagation();
    if (srcElement !== item) {
      srcElement.innerHTML = item.innerHTML;
      item.innerHTML = e.dataTransfer.getData('text/html');
    }
    item.classList.remove('over');
    updateArr();
    updateData();
    checkClick();
    return false;
  });
};

export { drag };

//addTaks.js
import { drag } from './drag.js';
import Trash from '../assets/trash.svg';
import Icon from '../assets/dots.svg';
import {
  updateData, getData, list,
} from './localStorage.js';
import { checkClick } from './tasks.js';

const placeholder = document.querySelector('.placeholder');
const input = document.querySelector('.add-list');
const addBtn = document.querySelector('.add-btn');
const clearBtn = document.querySelector('.footer-btn');

const newArr = getData();

let count = 0;

function addTask(e) {
  e.preventDefault();
  const row = document.createElement('div');
  row.setAttribute('data-id', count);
  row.classList.add('row');
  row.setAttribute('draggable', true);

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container');
  row.appendChild(textContainer);

  const checkBox = document.createElement('input');
  checkBox.classList.add('checkBox');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.setAttribute('data-task', count);
  textContainer.appendChild(checkBox);

  const text = document.createElement('span');
  text.textContent = input.value;
  text.classList.add('text');
  textContainer.appendChild(text);

  const iconCont = document.createElement('div');
  iconCont.classList.add('icon-cont');
  row.appendChild(iconCont);

  const deleteBtn = document.createElement('span');
  deleteBtn.style.backgroundImage = `url(${Trash})`;
  deleteBtn.classList.add('del-btn');
  deleteBtn.setAttribute('type', 'button');
  iconCont.appendChild(deleteBtn);

  const icon = document.createElement('span');
  icon.style.backgroundImage = `url(${Icon})`;
  icon.classList.add('row-icon');
  iconCont.appendChild(icon);
  placeholder.appendChild(row);
  updateData();
  drag(row);
  input.value = '';
  count++;
  window.location.reload();
}

function display() {
  for (let i = 0; i < newArr.length; i++) {
    const row = document.createElement('div');
    row.setAttribute('data-id', i);
    row.classList.add('row');
    row.setAttribute('draggable', true);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    row.appendChild(textContainer);

    const checkBox = document.createElement('input');
    checkBox.classList.add('checkBox');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('data-task', i);
    textContainer.appendChild(checkBox);

    const text = document.createElement('span');
    text.textContent = newArr[i].description;
    text.classList.add('text');
    textContainer.appendChild(text);

    const iconCont = document.createElement('div');
    iconCont.classList.add('icon-cont');
    row.appendChild(iconCont);

    const deleteBtn = document.createElement('span');
    deleteBtn.style.backgroundImage = `url(${Trash})`;
    deleteBtn.classList.add('del-btn');
    deleteBtn.setAttribute('type', 'button');
    iconCont.appendChild(deleteBtn);

    const icon = document.createElement('span');
    icon.style.backgroundImage = `url(${Icon})`;
    icon.classList.add('row-icon');
    iconCont.appendChild(icon);
    placeholder.appendChild(row);
    drag(row);
  }
}

const removeTask = (e) => {
  const element = e.target;
  if (element.classList[0] === 'del-btn') {
    element.parentElement.parentElement.remove();
  }
  updateData();
};

const clearAll = () => {
  const testArr = Array.from(list);
  const filterArr = testArr.filter((item) => item.classList.contains('completed'));
  filterArr.forEach((item) => item.remove());
  updateData();
};

clearBtn.addEventListener('click', clearAll);
placeholder.addEventListener('click', removeTask);
window.addEventListener('DOMContentLoaded', display);
window.addEventListener('load', checkClick);

export { addTask, addBtn, display };