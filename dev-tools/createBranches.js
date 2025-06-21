/* A JavaScript script likely created for development automation. This could be a utility the developer wrote to streamline a workflow—for instance, automating the creation of multiple git branches or setting up some project structure programmatically. It’s not used by the app at runtime, but rather a helper tool for project maintenance or setup.
*/
const { execSync } = require('child_process');
const slugs = require('./slugList');

slugs.forEach(slug => {
  try {
    execSync(`git branch ${slug}`, { stdio: 'inherit' });
  } catch (err) {
    // Ignore if branch exists or command fails
  }
});
