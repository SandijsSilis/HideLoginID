const input = document.getElementById('fieldInput');
const attrSelect = document.getElementById('attributeSelect');
const list = document.getElementById('fieldList');
const addBtn = document.getElementById('addBtn');

const defaultFields = [
  { attr: "type", value: "email" },
  { attr: "type", value: "username" },
  { attr: "name", value: "username" },
  { attr: "name", value: "IDToken1" },
  { attr: "name", value: "email" },
  { attr: "id", value: "username" },
  { attr: "id", value: "email" }
];

function updateListUI(fields) {
  list.innerHTML = '';
  fields.forEach((field, index) => {
    if (!field.attr || !field.value) return;
    const li = document.createElement('li');
    li.textContent = `${field.attr}: ${field.value}`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.onclick = () => {
      fields.splice(index, 1);
      chrome.storage.sync.set({ fields });
      updateListUI(fields);
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

addBtn.onclick = () => {
  const value = input.value.trim();
  const attr = attrSelect.value;
  if (value) {
    chrome.storage.sync.get({ fields: [] }, ({ fields }) => {
      if (!Array.isArray(fields)) fields = [];
      const exists = fields.some(f => f.attr === attr && f.value === value);
      if (!exists) {
        fields.push({ attr, value });
        chrome.storage.sync.set({ fields });
        updateListUI(fields);
        input.value = '';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['fields'], (data) => {
    let fields = data.fields;
    const valid = Array.isArray(fields) && fields.every(f => f && f.attr && f.value);
    if (!valid || fields.length === 0) {
      chrome.storage.sync.set({ fields: [...defaultFields] }, () => {
        updateListUI([...defaultFields]);
      });
    } else {
      updateListUI(fields);
    }
  });
});