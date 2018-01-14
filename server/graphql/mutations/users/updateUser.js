const { GraphQLNonNull, GraphQLID } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Users')

const User = mongoose.model('User')
const UserGroup = mongoose.model('UserGroup')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ events, perms, socketEvent }, { _id, data }, ctx) {
    const isSameUser = JSON.stringify(_id) === JSON.stringify(ctx.user._id)
    if (!perms.users.canEditUsers && !isSameUser) throw new Error('You do not have permission to edit users.')

    const foundUser = await User.findById(_id).lean().exec()
    if (!foundUser) throw new Error('There is no User with this ID.')

    const isSameUserGroup = JSON.stringify(foundUser.usergroup) === JSON.stringify(data.usergroup)
    if (!perms.users.canChangeUsersUsergroup && !isSameUserGroup) throw new Error('You do not have permission to change a user\'s usergroup.')
    if (!await UserGroup.findById(data.usergroup).lean().exec()) throw new Error('That usergroup does not exist')

    events.emit('pre-update-user', { _id, data })

    const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true }).exec()

    /* istanbul ignore if */
    if (!updatedUser) throw new Error('Error updating user')

    await User.populate(updatedUser, { path: 'usergroup' })

    socketEvent('update-user', updatedUser)
    events.emit('post-update-user', updatedUser)
    return updatedUser
  }
}
