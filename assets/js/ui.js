
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { cls, text, html, attrs, dataset } = options;
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  if (html !== undefined) node.innerHTML = html;
  if (attrs) Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (dataset) Object.entries(dataset).forEach(([key, value]) => node.dataset[key] = value);
  if (!Array.isArray(children)) children = [children];
  children.filter(Boolean).forEach((child) => node.append(child));
  return node;
}

export function field(labelText, inputNode, helpText = '') {
  const wrapper = el('div', { cls: 'field-group' });
  wrapper.append(el('label', { text: labelText }));
  wrapper.append(inputNode);
  if (helpText) wrapper.append(el('small', { cls: 'help', text: helpText }));
  return wrapper;
}

export function sectionHeader(title, copy = '') {
  return el('div', {}, [
    el('h2', { cls: 'step-title', text: title }),
    el('p', { cls: 'step-copy', text: copy })
  ]);
}

export function setMessage(messageBar, text = '', kind = 'info') {
  if (!text) {
    messageBar.hidden = true;
    messageBar.textContent = '';
    messageBar.className = 'message-bar';
    return;
  }
  messageBar.hidden = false;
  messageBar.textContent = text;
  messageBar.className = `message-bar ${kind}`;
}
