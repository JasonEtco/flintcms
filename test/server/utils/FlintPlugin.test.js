const FlintPlugin = require('../../../server/utils/FlintPlugin');

describe('FlintPlugin', () => {
  class MyPlugin extends FlintPlugin {
    static get uid() { return 'my-plugin'; }
  }

  class MyBadPlugin extends FlintPlugin {}

  it('returns the correct uid', () => {
    return expect(MyPlugin.uid).toBe('my-plugin');
  });

  it('returns false when a uid has not been set', () => {
    return expect(MyBadPlugin.uid).toBe(false);
  });

  it('returns the correct title', () => {
    return expect(MyPlugin.title).toBe('');
  });

  it('returns the correct name', () => {
    return expect(MyPlugin.name).toBe('MyPlugin');
  });

  it('returns the correct icon', () => {
    return expect(typeof MyPlugin.icon).toBe('string');
  });

  it('returns the correct model', () => {
    return expect(MyPlugin.model).toEqual({});
  });
});
