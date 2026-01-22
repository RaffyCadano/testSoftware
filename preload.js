const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, cb) => ipcRenderer.on(channel, (event, ...args) => cb(...args))
});

contextBridge.exposeInMainWorld('apiInvoke', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});
