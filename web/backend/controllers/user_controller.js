const UserService = require('../services/user_service')
const Session = require('../entities/session')
const User = require('../entities/user')
const { getRequestBody } = require('../utils/util')
const md5 = require('md5')

class UserController {

    constructor() {
        this.userService = new UserService()
    }

    async signUpGet(client) {
        try {
            // Registration
            const { res } = client

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return '<h2>Registration page with forms</h2>'
        } catch (error) {
            console.log(error)
        }
    }

    async signInGet(client) {
        try {
            // Login
            const { res } = client

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return '<h2>Login page with forms</h2>'
        } catch (error) {
            console.log(error)
        }
    }

    async signUpPost(client) {
        try {
            // Registration
            const { req, res } = client
            const body = await getRequestBody(req)
            const { firstName, lastName, username, password } = body
            const user = new User(firstName, lastName, username, md5(password))
            const userId = await this.userService.save(user)
            await Session.start(client, {userId, 'startTime': new Date()})
            client.sendCookie()
            console.log('Signup: Session have been created')

            res.writeHead(302, {Location: '/'})
            return 
        } catch (error) {
            console.log(error)
        }
    }

    async signInPost(client) {
        try {
            // Login
            const { req, res } = client
            const body = await getRequestBody(req)
            
            const user = await this.userService.findByUsername(body.username)
            console.log('UserController: user:')
            console.log(user)
            if (user) {
                if (user.password === md5(body.password)) {
                    await Session.start(client, {'userId': user.id, 'startTime': new Date()})
                    client.sendCookie()
                    res.writeHead(302, {Location: '/'})
                    return 
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                    return {'error': {
                        'code': 400,
                        'message': 'Incorrect password'
                        }
                    }
                }
            }

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            return {'error': {
                'code': 400,
                'message': 'User not found'
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async signOutPost(client) {
        const { res } = client
        await Session.delete(client)
        client.sendCookie()
        res.writeHead(302, {Location: '/users/signin'})
        return
    }
}

module.exports = UserController