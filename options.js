document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({ "OPENAI_API_KEY": apiKey }, () => {
    alert('API Key saved successfully.');
  });
});