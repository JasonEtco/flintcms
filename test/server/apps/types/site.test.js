const mocks = require('../../../mocks');
const common = require('../common');
const mongoose = require('mongoose');

describe('Site', () => {
  let agent;

  beforeAll(async () => {
    agent = await common.before();
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  it('returns the site config', (done) => {
    agent
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
        expect(res.body).toEqual({
          data: {
            site: {
              siteName: mocks.site[0].siteName,
              siteUrl: mocks.site[0].siteUrl,
              style: mocks.site[0].style,
            },
          },
        });
        return done();
      });
  });

  it('updates the site document', (done) => {
    agent
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
        expect(res.body).toEqual({
          data: {
            updateSite: {
              siteName: 'New site name',
            },
          },
        });
        return done();
      });
  });

  describe('Permissions', () => {
    beforeAll(common.setNonAdmin);

    it('cannot update the site document', (done) => {
      agent
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
          expect(res.body.errors[0]).toMatchObject({
            message: 'You do not have permission to manage site configuration.',
          });
          return done();
        });
    });

    afterAll(common.setAdmin);
  });
});
