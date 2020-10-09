/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const cookiesMap = getCookies();
let filterValue = '';

updateTable();

function getCookies() {
  return document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');

    prev[name] = value;

    return prev;
  }, new Map());
}

filterNameInput.addEventListener('input', function () {
  filterValue = this.value;
  updateTable();
});

addButton.addEventListener('click', () => {
  const name = `${addNameInput.value}`;
  const value = `${addValueInput.value}`;

  if (!name) {
    return;
  }

  document.cookie = `${name}=${value}`;
  cookiesMap.set(name, value);

  updateTable();
});

listTable.addEventListener('click', (e) => {
  const { role, cookieName } = e.target.dataset;

  if (role === 'del-btn') {
    cookiesMap.delete(cookieName);
    document.cookie = `${cookieName}=deleted; max-age=0`;
    updateTable();
  }
});

function updateTable() {
  const fragment = document.createDocumentFragment();
  let total = 0;

  listTable.innerHTML = '';

  for (const [name, value] of cookiesMap) {
    if (
      filterValue &&
      !name.toLowerCase().includes(filterValue.toLowerCase()) &&
      !value.toLowerCase().includes(filterValue.toLowerCase())
    ) {
      continue;
    }

    total++;

    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');
    const tdDel = document.createElement('td');
    const buttonDel = document.createElement('button');

    tdName.textContent = name;
    tdValue.textContent = value;
    tdValue.classList.add('value');

    buttonDel.textContent = 'Удалить';
    buttonDel.dataset.role = 'del-btn';
    buttonDel.dataset.cookieName = name;

    tr.append(tdName);
    tr.append(tdValue);
    tr.append(tdDel);
    tdDel.append(buttonDel);

    fragment.append(tr);
  }

  if (total) {
    listTable.append(fragment);
    listTable.parentNode.classList.remove('hidden');
  } else {
    listTable.parentNode.classList.add('hidden');
  }
}
