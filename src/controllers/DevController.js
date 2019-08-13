const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
  async index (request, response) {
    const { user } = request.headers
    const loggedDev = await Dev.findById(user)
    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    })

    return response.json(users)
  },
  async store (request, response) {
    const { username } = request.body

    const devExists = await Dev.findOne({ user: username })

    if (devExists) {
      return response.json(devExists)
    }

    const responseAxios = await axios.get(`https://api.github.com/users/${username}`)

    const { name, bio, avatar_url: avatar } = responseAxios.data

    const dev = await Dev.create({
      name: name,
      user: username,
      bio: bio,
      avatar: avatar
    })

    return response.json(dev)
  }
}
