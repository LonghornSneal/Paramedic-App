const { execSync } = require('child_process');
const slugs = require('./slugList');

slugs.forEach(slug => {
  try {
    execSync(`git branch ${slug}`, { stdio: 'inherit' });
  } catch (err) {
    // Ignore if branch exists or command fails
  }
});
