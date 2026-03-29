const { shutdownPreviewServer } = require('./previewServer.cjs');

module.exports = async () => {
  await shutdownPreviewServer();
};
