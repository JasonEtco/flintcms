const helpers = require('./helpers');

describe('slugify', () => {
  it('should convert a string to kebab-case', () => {
    expect(helpers.slugify('This is a test!')).toBe('this-is-a-test');
  });
});
