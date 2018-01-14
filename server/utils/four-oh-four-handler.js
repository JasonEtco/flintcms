const compile = require('./compile')

module.exports = async (req, res) => {
  const compiled = await compile('404')
  if (compiled === 'no-template') return res.redirect('/admin/error?r=no-template&p=404&t=404')
  return res.status(404).send(compiled)
}
