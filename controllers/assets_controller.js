const fsp = require('fs/promises')
const path = require('path')

const { STATUS_CODES, MIME_TYPES, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const BACK_TO_ROOT_FOLDER = '../'
const HTML_FOLDER = 'frontend/html'
const NOT_FOUND_PAGE = '404.html'
const MAIN_PAGE = 'main.html'
const SIGN_IN_PAGE = 'signin.html'
const SIGN_UP_PAGE = 'signup.html'

const getAsset = (file, assetFolder='') => {
    const filePath = assetFolder ? 
        path.join(assetFolder, file) :
        path.join(__dirname, BACK_TO_ROOT_FOLDER, file)

    return (mimeType) => async (client) => {
        client.res.writeHead(STATUS_CODES.OK, {'Content-Type': mimeType})
        try {
            return await fsp.readFile(filePath, {encoding: 'utf-8'})
        } catch (error) {
            await logger.error(error.message)
        }
    }
}

const signUpAsset = getAsset(SIGN_UP_PAGE, HTML_FOLDER)(MIME_TYPES.HTML)
const signInAsset = getAsset(SIGN_IN_PAGE, HTML_FOLDER)(MIME_TYPES.HTML)
const mainAsset = getAsset(MAIN_PAGE, HTML_FOLDER)(MIME_TYPES.HTML)
const notFoundAsset = getAsset(NOT_FOUND_PAGE, HTML_FOLDER)(MIME_TYPES.HTML)

class AssetsController {

    async getSignUpPage(client) {
        return await signUpAsset(client)
    }

    async getSignInPage(client) {
        return await signInAsset(client)
    }

    async getMainPage(client) {
        return await mainAsset(client)
    }

    async getNotFoundPage(client) {
        return await notFoundAsset(client)
    }

    async getCSSFile(client) {
        return await getAsset(client.req.url)(MIME_TYPES.CSS)(client)
    }

    async getJSFile(client) {
        return await getAsset(client.req.url)(MIME_TYPES.JS)(client)
    }

}

module.exports = AssetsController