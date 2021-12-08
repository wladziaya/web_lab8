const SessionModel = require('../models/session_model')
const { generateToken } = require('../utils/util')

const storage = new SessionModel()

class Session {

    static inMemoryStorage = new Map()

    constructor(id) {
        this.id = id
    }

    static async start(client, data) {
        if (client.sessionID) return client.sessionID
        const token = generateToken()
        this.inMemoryStorage.set(token, data)
        await Session.save(token, data.username, data.startTime)
        client.sessionID = token
        console.log(`Start: ${client.sessionID}`)
        client.setCookie('session', token)
        return token
    }

    static async restore(client) {
        try {
            console.log(`Session restore: start`)
            const { cookies } = client
            console.log(`Session restore: cookie ${cookies}`)
            if (!cookies) return
            const sessionID = cookies.session
            if (sessionID) {
                if (this.inMemoryStorage.get(sessionID)) {
                    // client`s cookie session found in memory
                    client.sessionID = sessionID
                    console.log(`Session restore: restored ${client.sessionID} from memory`)
                } else if (await storage.get(sessionID)) {
                    // client`s cookie session found in storage
                    client.sessionID = sessionID
                    console.log(`Session restore: restored ${client.sessionID} from storage`)
                } else {
                    // client`s cookie session is absent in system
                    await this.delete(client)
                    console.log(`Session restore: invalid session ${client.sessionID}`)
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    static async delete(client) {
        try {
            const { sessionID } = client
            if (sessionID) {
                this.inMemoryStorage.delete(sessionID)
                await storage.delete(sessionID)
                client.sessionID = undefined
                client.deleteCookie('session')
                console.log('Session delete: deleted')
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    static async save(token, username, startTime) {
        try {
            await storage.save({token, username, startTime})
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = Session