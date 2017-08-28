const mocks = require('../../../mocks');
const expect = require('expect');
const common = require('../common');

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

it('updates the site document', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `mutation ($data: SiteInput!) {
        updateSite (data: $data) {
          siteName
        }
      }`,
      variables: {
        data: {
          siteName: 'New site name',
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          updateSite: {
            siteName: 'New site name',
          },
        },
      });
      return done();
    });
});

describe('Permissions', function () {
  before('Set to non-admin', common.setNonAdmin);

  it('cannot update the site document', (done) => {
    global.agent
      .post('/graphql')
      .send({
        query: `mutation ($data: SiteInput!) {
          updateSite (data: $data) {
            siteName
            siteUrl
            style
          }
        }`,
        variables: {
          data: {
            siteName: 'New site name',
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text).errors[0]).toInclude({
          message: 'You do not have permission to manage site configuration.',
        });
        return done();
      });
  });

  after('Set to admin', common.setAdmin);
});
