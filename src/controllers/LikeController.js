const Dev = require('../models/Dev')

module.exports = {
  async store (request, response) {
    const { user } = request.headers
    const { devId } = request.params

    const loggedDev = await Dev.findById(user)
    const targetDev = await Dev.findById(devId)

    if (!targetDev) {
      return response.status(400).json({ error: 'Dev não existe!' })
    }
    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = request.connectedDevs[user]
      const targetSocket = request.connectedDevs[devId]

      if (loggedSocket) {
        request.io.to(loggedSocket).emit('match', targetDev)
      }
      if (targetSocket) {
        request.io.to(targetSocket).emit('match', loggedDev)
      }
    }

    loggedDev.likes.push(targetDev._id)

    await loggedDev.save()

    return response.json(loggedDev)
  }
}
