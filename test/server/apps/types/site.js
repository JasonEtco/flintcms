const mocks = require('../../../__mocks__');
const expect = require('expect');

it('returns the site config', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `
      {
        site {
          siteName
          siteUrl
          style
        }
      }`,
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          site: {
            siteName: mocks.site.siteName,
            siteUrl: mocks.site.siteUrl,
            style: mocks.site.style,
          },
        },
      });
      return done();
    });
});
