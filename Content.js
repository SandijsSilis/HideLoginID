let cachedSelectors = [];

chrome.storage.sync.get("fields", ({ fields }) => {
  if (!Array.isArray(fields)) return;
  cachedSelectors = fields.map(f => `input[${f.attr}="${f.value}"]`).join(',');
  applyHide();
});

function applyHide() {
  if (!cachedSelectors) return;

  try {
    const inputs = document.querySelectorAll(cachedSelectors);
    inputs.forEach(input => {
      input.style['-webkit-text-security'] = 'disc';
      input.placeholder = "Field has been hidden";
    });
  } catch (err) {
    console.warn("Selector error:", err);
  }
}