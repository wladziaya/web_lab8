const fsp = require('fs/promises')
const path = require('path')

const { STATUS_CODES, MIME_TYPES, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const BACK_TO_WEB_FOLDER = '../../'
const NOT_FOUND_PAGE = 'frontend/html/404.html'
const MAIN_PAGE = 'frontend/html/main.html'

class AssetsController {
    
    async getCSSFile(client) {
        const { req, res } = client
        res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.CSS})
        const filePath = path.join(__dirname, BACK_TO_WEB_FOLDER, req.url)
        await logger.debug(`getCSSFile: filePath=${filePath}`)
        return await fsp.readFile(filePath)
    }

    async getJSFile(client) {
        const { req, res } = client
        res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JS})
        const filePath = path.join(__dirname, BACK_TO_WEB_FOLDER, req.url)
        await logger.debug(`getJSFile: filePath=${filePath}`)
        return await fsp.readFile(filePath)
    }

    async getNotFoundPage(client) {
        const { res } = client
        res.writeHead(STATUS_CODES.NOT_FOUND, {'Content-Type': MIME_TYPES.HTML})
        const filePath = path.join(__dirname, BACK_TO_WEB_FOLDER, NOT_FOUND_PAGE)
        await logger.debug(`getNotFoundPage: filePath=${filePath}`)
        return await fsp.readFile(filePath)
    }

    async getMainPage(client) {
        const { req, res } = client
        res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.HTML})
        const filePath = path.join(__dirname, BACK_TO_WEB_FOLDER, MAIN_PAGE)
        await logger.debug(`getMainPage: filePath=${filePath}`)
        return await fsp.readFile(filePath)
    }
}

module.exports = AssetsController
