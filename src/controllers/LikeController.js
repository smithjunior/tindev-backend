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
    if (targetDev.likes.includes(user)) {
      const loggedSocket = request.connectDevs[loggedDev._id]
      const targetSocket = request.connectDevs[targetDev._id]
      if (loggedSocket) {
        request.io.to(loggedSocket).emit('match', targetDev)
      }
      if (targetSocket) {
        request.io.to(targetSocket).emit('match', loggedSocket)
      }
    }

    loggedDev.likes.push(targetDev._id)

    await loggedDev.save()

    return response.json(loggedDev)
  }
}
