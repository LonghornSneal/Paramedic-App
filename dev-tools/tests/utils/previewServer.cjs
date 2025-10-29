const http = require('node:http');
const path = require('node:path');
const httpServer = require('http-server');

const DEFAULT_PORT = 5173;
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

let serverInstance = null;
let serverPromise = null;

function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function probe() {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server at ${url} not reachable`));
        } else {
          setTimeout(probe, 500);
        }
      });
    })();
  });
}

async function ensurePreviewServer(port = DEFAULT_PORT) {
  const targetUrl = `http://localhost:${port}`;
  try {
    await waitForHttp(targetUrl, 2000);
    return;
  } catch {
    // Server not running yet.
  }

  if (serverPromise) {
    await serverPromise;
    await waitForHttp(targetUrl);
    return;
  }

  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
    serverInstance = null;
  }

  serverPromise = (async () => {
    const server = httpServer.createServer({
      root: REPO_ROOT,
      cache: -1,
      showDir: false,
    });

    await new Promise((resolve, reject) => {
      const httpNative = server.server;
      const handleError = (error) => {
        if (httpNative && httpNative.off) {
          httpNative.off('error', handleError);
        }
        reject(error);
      };
      if (httpNative && httpNative.once) {
        httpNative.once('error', handleError);
      }
      server.listen(port, () => {
        if (httpNative && httpNative.off) {
          httpNative.off('error', handleError);
        }
        resolve();
      });
    });

    serverInstance = server;
  })();

  try {
    await serverPromise;
  } catch (error) {
    if (error && error.code === 'EADDRINUSE') {
      // Another worker won the race to start the preview server; reuse it.
      await waitForHttp(targetUrl);
      return;
    }
    throw error;
  } finally {
    serverPromise = null;
  }
  await waitForHttp(targetUrl);
}

async function shutdownPreviewServer() {
  if (serverPromise) {
    try {
      await serverPromise;
    } catch {
      // ignore start-up failures
    }
  }
  if (!serverInstance) return;
  await new Promise((resolve) => serverInstance.close(resolve));
  serverInstance = null;
}

module.exports = {
  ensurePreviewServer,
  shutdownPreviewServer,
};
