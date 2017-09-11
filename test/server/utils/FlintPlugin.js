const FlintPlugin = require('../../../server/utils/FlintPlugin');
const expect = require('chai').expect;

describe('FlintPlugin', function () {
  class MyPlugin extends FlintPlugin {
    static get uid() { return 'my-plugin'; }
  }

  it('returns the correct uid', function () {
    return expect(MyPlugin.uid).to.equal('my-plugin');
  });

  it('returns the correct title', function () {
    return expect(MyPlugin.title).to.equal('');
  });

  it('returns the correct name', function () {
    return expect(MyPlugin.name).to.equal('MyPlugin');
  });

  it('returns the correct icon', function () {
    return expect(MyPlugin.icon).to.be.a('string');
  });

  it('returns the correct model', function () {
    return expect(MyPlugin.model).to.be.deep.equal({});
  });
});
