const http = require('http')
const UserController = require('./controllers/user_controller')
const Client = require('./entities/client')
const Session = require('./entities/session')

const userController = new UserController()

const hostname = '127.0.0.1'
const port = 8000

// Test stuff
const users = [{name: 'Jack', lastname: 'Daniels', age: '40'}]

const routing = {
    'GET': {
        '/': async (client) => {
            client.res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return '<h1>Main page</h1>'
        },
        '/users': async (client) => users,
        '/users/signin': async (client) => userController.signInGet(client),
        '/users/signup': async (client) => userController.signUpGet(client)
    },
    'POST': {
        '/users/signin': async (client) => userController.signInPost(client),
        '/users/signup': async (client) => userController.signUpPost(client),
        '/users/signout': async (client) => userController.signOutPost(client) 
    }
}

const rendering = {
    string: s => s,
    object: JSON.stringify,
    undefined: () => 'Not Found',
}

const securityPatch = (fn) => (client) => {
    const { req, res, sessionID } = client

    console.log(`Patcher: session=${sessionID}, req=${req}, res=${res}, method=${req.method}`)

    // User in system tries to sign up or sing in
    if (sessionID && (req.url === '/users/signin' | req.url === '/users/signup')) {
        console.log('User in system')
        if (req.method === 'GET') {res.writeHead(302, {Location: '/'}); return}
        else if (req.method === 'POST') return {'error': {'code': 400, 'message': 'User can`t do this while being authorized'}}
    }

    // User NOT in system tries to get access to resources except sing in and sing up
    if (!sessionID && (req.url !== '/users/signin' && req.url !== '/users/signup')) {
        console.log('User NOT in system')
        if (req.method === 'GET') {res.writeHead(302, {Location: '/users/signin'}); return}
        else if (req.method === 'POST') {res.writeHead(403, 'Forbidden'); return}
    }

    return fn(client)
}

const server = http.createServer(async (req, res) => {
    try {
        const client = new Client(req, res)
        await Session.restore(client)

        console.log(`${req.method}: ${req.url}`)
        console.log(`Cookies: \n${req.headers.cookie}`)
        console.log(`Session: ${client.sessionID}`)
    
        const handler = routing[req.method][req.url]
        if (!handler) {
            res.statusCode = 404
            res.end('Not Found 404')
        }

        const patchedHandler = securityPatch(handler)
        const data = await patchedHandler(client)
        const type = typeof data
        const renderer = rendering[type]
        const result = renderer(data)
        res.end(result)
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end('Internal Server Error 500')
    }
})


server.listen(port, hostname, () => {
    console.log(`Server running on ${hostname}:${port}`)
})