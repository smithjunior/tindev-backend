const axios = require('axios')
const Dev = require('../models/Dev')
function shuffle (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
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

    
    return response.json(shuffle(users))
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
