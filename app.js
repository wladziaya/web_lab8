const http = require('http')
const { STATUS_CODES, LOGS_FILEPATH } = require('./config')

const Client = require('./entities/client')
const Session = require('./entities/session')
const Logger = require('./utils/logger')

const AsesstsController = require('./controllers/assets_controller')

const router = require('./routes/router')
const securityPatch = require('./routes/restrictions')

const logger = new Logger(LOGS_FILEPATH, __filename)

const assetsController = new AsesstsController()

const hostname = process.env.APP_HOST || '127.0.0.1'
const port = process.env.PORT || 8000

const rendering = {
    string: s => s,
    object: JSON.stringify,
    undefined: () => 'Not Found',
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