const UserService = require('../services/user_service')

const User = require('../entities/user')

const Session = require('../entities/session')
const Logger = require('../utils/logger')

const { getRequestBody, generateError, noJSONBodyHandler } = require('../utils/util')
const { STATUS_CODES, ROUTES, MIME_TYPES, LOGS_FILEPATH, ERROR_MESSAGES } = require('../config')

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
            await logger.debug(`SignUp: recieved request body = ${body} `)

            if (!body) return noJSONBodyHandler(res, ERROR_MESSAGES.EMPTY_REQUEST_BODY)

            const { firstName, lastName, username, password } = body
            const userId = await this.userService.create(firstName, lastName, username, md5(password))
            await Session.start(client, {'user_id': userId, 'start_time': new Date()})
            client.sendCookie()
            await logger.info('Signup: Session have been created')
            res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN})
            return ''
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
            await logger.debug(`SignIn: recieved request body = ${body} `)

            if (!body) return noJSONBodyHandler(res, ERROR_MESSAGES.EMPTY_REQUEST_BODY)

            const user = await this.userService.findByUsername(body.username)
            if (!user) {
                res.writeHead(STATUS_CODES.BAD_REQUEST, {'Content-Type': MIME_TYPES.JSON})
                return generateError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.NO_SUCH_USER)
            }

            if (user.password !== md5(body.password)) {
                res.writeHead(STATUS_CODES.BAD_REQUEST, {'Content-Type': MIME_TYPES.JSON})
                return generateError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.INCORRECT_PASSWORD)
            }

            await Session.start(client, {'user_id': user.id, 'start_time': new Date()})
            client.sendCookie()
            res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN})
            return ''
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
            return ''
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // GET
    async findCurrentUser(client) {
        const { res } = client
        const session = await Session.get(client)
        const user = await this.userService.findById(session['user_id'])
        await logger.debug(`FindById: ${user['username']}, ${user['first_name']}, ${user['last_name']}`)
        res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON}) 
        return {'username': user['username'], 'firstName': user['first_name'], 'lastName': user['last_name']}
    }
}

module.exports = UserController