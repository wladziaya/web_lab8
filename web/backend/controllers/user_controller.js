const UserService = require('../services/user_service')

const User = require('../entities/user')

const Session = require('../entities/session')
const Logger = require('../utils/logger')

const { getRequestBody, generateError } = require('../utils/util')
const { STATUS_CODES, ROUTES, MIME_TYPES, LOGS_FILEPATH } = require('../config')

const md5 = require('md5')

const logger = new Logger(LOGS_FILEPATH, __filename)

class UserController {

    constructor() {
        this.userService = new UserService()
    }

    // POST
    async signUp(client) {
        try {
            // Registration
            const { req, res } = client
            const body = await getRequestBody(req)

            if(!body) {
                await logger.debug('SignUpPost: recieved request body is empty')
                res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON})
                return generateError(STATUS_CODES.BAD_REQUEST, 'Get no JSON data from POST request')
            }
            await logger.debug('SignUpPost: recieved request body contains data')

            const { firstName, lastName, username, password } = body
            const user = new User(firstName, lastName, username, md5(password))
            const userId = await this.userService.create(user)
            await Session.start(client, {'user_id': userId, 'start_time': new Date()})
            client.sendCookie()
            await logger.info('Signup: Session have been created')
            res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN})
            return
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // POST
    async signIn(client) {
        try {
            // Login
            const { req, res } = client
            const body = await getRequestBody(req)

            if(!body) {
                await logger.debug('SignInPost: recieved request body is empty')
                res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON})
                return generateError(STATUS_CODES.BAD_REQUEST, 'Get no JSON data from POST request')
            }
            await logger.debug('SignInPost: recieved request body contains data')

            const user = await this.userService.findByUsername(body.username)
            if (user) {
                if (user.password === md5(body.password)) {
                    await Session.start(client, {'user_id': user.id, 'start_time': new Date()})
                    client.sendCookie()
                    res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN})
                    return 
                } else {
                    res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON})
                    return generateError(STATUS_CODES.BAD_REQUEST, 'Incorrect password')
                }
            }

            res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON})
            return generateError(STATUS_CODES.BAD_REQUEST, 'User not found')
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // DELETE
    async signOut(client) {
        try {
            const { res } = client
            await Session.delete(client)
            client.sendCookie()
            res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.SIGN_IN})
            return
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // GET
    async findById(client) {
        const { res } = client
        const session = await Session.get(client)
        const user = await this.userService.findById(session['user_id'])
        await logger.debug(`FindById: ${user['username']}, ${user['first_name']}, ${user['last_name']}`)
        res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON}) 
        return {'username': user['username'], 'firstName': user['first_name'], 'lastName': user['last_name']}
    }
}

module.exports = UserController