const { ensurePreviewServer } = require('./previewServer.cjs');

module.exports = async () => {
  await ensurePreviewServer();
};
