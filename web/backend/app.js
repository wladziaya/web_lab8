const http = require('http')
const { STATUS_CODES, ROUTES, LOGS_FILEPATH } = require('./config')

const Client = require('./entities/client')
const Session = require('./entities/session')
const Logger = require('./utils/logger')

const AsesstsController = require('./controllers/assets_controller')

const router = require('./routes/router')

const logger = new Logger(LOGS_FILEPATH, __filename)

const assetsController = new AsesstsController()

const hostname = '127.0.0.1'
const port = 8000

const rendering = {
    string: s => s,
    object: JSON.stringify,
    undefined: () => 'Not Found',
}

const securityPatch = (fn) => async (client) => {
    const { req, res, sessionID } = client

    await logger.info(`Patcher: session=${sessionID}, method=${req.method}`)

    // User in system tries to sign up or sing in
    if (sessionID && (req.url === ROUTES.GENERAL.SIGN_IN | req.url === ROUTES.GENERAL.SIGN_UP)) {
        await logger.info('User in system')
        if (req.method === 'GET') {res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN}); return}
        else if (req.method === 'POST') return {'error': {'code': STATUS_CODES.BAD_REQUEST, 'message': 'User can`t do this while being authorized'}}
    }

    // User NOT in system tries to get access to resources except sing in, sing up and frontend files (.css, .js)
    if (!sessionID && (req.url !== ROUTES.GENERAL.SIGN_IN && req.url !== ROUTES.GENERAL.SIGN_UP && !req.url.match(/\/frontend\/(css|js)/))) {
        await logger.info('User NOT in system')
        if (req.method === 'GET') {res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.SIGN_IN}); return}
        else if (req.method === 'POST') {res.writeHead(STATUS_CODES.FORBIDDEN, 'Forbidden'); return}
    }

    return await fn(client)
}

const server = http.createServer(async (req, res) => {
    try {
        const client = new Client(req, res)
        await Session.restore(client)

        await logger.info(`${req.method}: ${req.url} `)
        await logger.info(`Cookies: ${req.headers.cookie}`)
        await logger.info(`Session: ${client.sessionID}`)

        const handler = router(req)
        await logger.debug(`handler: ${handler}`)

        if (!handler) {
            res.end(await assetsController.getNotFoundPage(client))
            return
        }

        const patchedHandler = securityPatch(handler)
        const data = await patchedHandler(client)

        let result
        if (data instanceof Buffer) {
            result = data
        } else {
            const type = typeof data
            const renderer = rendering[type]
            result = renderer(data)
        }
        
        res.end(result)
    } catch (error) {
        await logger.error(error.message)
        res.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
        res.end('Internal Server Error 500')
    }
})


server.listen(port, hostname, async () => {
    await logger.info(`Server running on ${hostname}:${port}`)
})