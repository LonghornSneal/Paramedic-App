/* A sample unit test file (likely using a framework like Jest) that tests the functionality of add.js. This confirms that the testing setup is working and serves as a template for writing additional tests. Future tests for application features (e.g., ensuring protocols load correctly, verifying dosage calculations) will be added here.
*/
const add = require('./add');

test('adds 2 + 2 to equal 4', () => {
  expect(add(2, 2)).toBe(4);
});
