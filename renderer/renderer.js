document.getElementById('ping').addEventListener('click', () => {
  window.api.send('ping', 'hello from renderer');
});

window.api.on('pong', (msg) => {
  document.getElementById('reply').textContent = msg;
});

// fetch and display the app version
if (window.apiInvoke && window.apiInvoke.invoke) {
  window.apiInvoke.invoke('get-app-version').then(version => {
    const el = document.getElementById('version');
    if (el) el.textContent = version;
  }).catch(() => {
    const el = document.getElementById('version');
    if (el) el.textContent = 'unknown';
  });
}

// updater UI
const checkBtn = document.getElementById('check-updates');
const installBtn = document.getElementById('install-update');
const updateText = document.getElementById('update-text');

if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    updateText.textContent = 'checking';
    window.api.send('check-for-updates');
  });
}

if (installBtn) {
  installBtn.addEventListener('click', () => {
    window.api.send('install-update');
  });
}

window.api.on('checking-for-update', () => { updateText.textContent = 'checking'; });
window.api.on('update-available', (info) => { updateText.textContent = 'update available'; });
window.api.on('update-not-available', () => { updateText.textContent = 'no updates'; });
window.api.on('update-error', (err) => { updateText.textContent = 'error'; console.error(err); });
window.api.on('download-progress', (progress) => {
  const percent = Math.round(progress.percent);
  updateText.textContent = `downloading ${percent}%`;
});
window.api.on('update-downloaded', () => {
  updateText.textContent = 'ready to install';
  if (installBtn) installBtn.disabled = false;
});
