function between(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSelectedText() {
  return new Promise(resolve => {
    chrome.tabs.executeScript(
      {
        code: 'window.getSelection().toString();'
      },
      selection => {
        const err = chrome.runtime.lastError;
        resolve(selection ? selection[0] : '');
      }
    );
  });
}

function escapeHTMLEntities(s) {
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  return s.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
}

export { between, getSelectedText, escapeHTMLEntities }
