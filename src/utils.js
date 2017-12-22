function between(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSelectedText() {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(
      {
        code: 'window.getSelection().toString();'
      },
      selection => {
        resolve(selection[0]);
      }
    );
  });
}

export { between, getSelectedText }
