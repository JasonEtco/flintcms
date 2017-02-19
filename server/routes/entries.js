const mongoose = require('mongoose');
const h = require('../utils/helpers');
const graphql = require('graphql');
const schema = require('../graphql');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

module.exports = (app, io) => {
  app.get('/admin/api/entries', h.loggedIn, async (req, res) => {
    // const { query, params } = this.query;
    // const resp = await graphql(schema, query, '', params);
    // if (resp.errors) {
    //   this.status = 400;
    //   this.body = {
    //     errors: resp.errors,
    //   };
    //   return;
    // }
    // res.status(200).json(resp);
    // this.body = resp;

    // Entry.find()
    //   .then(entries => res.status(200).json(entries))
    //   .catch(err => new Error(err));
  });

  app.post('/admin/api/entries', h.loggedIn, (req, res) => {
    const { title, sectionId, fields } = req.body;
    const slug = h.slugify(title);

    process.nextTick(() => {
      Section.findById(sectionId)
        .then((section) => {
          if (!section) res.status(409).json({ success: false, message: 'That section does not exist.' });

          Entry.findOne({ slug }).then((entry) => {
            if (entry) {
              res.status(409).json({ success: false, message: 'There is already an entry with that slug.' });
              return;
            }

            const values = fields
              .reduce((prev, curr) =>
                Object.assign({}, prev, { [curr.fieldSlug]: curr.value }), {});

            const newEntry = new Entry(values);

            newEntry.title = title;
            newEntry.slug = slug;
            newEntry.section = section._id;
            newEntry.fields = fields;
            newEntry.dateCreated = Date.now();
            newEntry.author = req.user._id;

            newEntry.save()
              .then((savedEntry) => {
                io.emit('new-entry', savedEntry);
                res.status(200).json(savedEntry);
              })
              .catch(err => new Error(err));
          })
          .catch(err => new Error(err));
        })
        .catch(err => new Error(err));
    });
  });
};
