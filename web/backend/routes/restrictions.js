const { generateError } = require('../utils/util')
const { STATUS_CODES, ROUTES, MIME_TYPES, ERROR_MESSAGES } = require('../config')

const userInSystemHandler = {
    GET: (client) => {
        client.res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.MAIN})
        return ''
    },
    POST: (client) => {
        client.res.writeHead(STATUS_CODES.BAD_REQUEST, {'Content-Type': MIME_TYPES.JSON})
        return generateError(STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.RESTRICTION_FOR_AUTHORIZED_USERS)
    }
}

const userNotInSystemHandler = {
    GET: (client) => {
        client.res.writeHead(STATUS_CODES.FOUND, {Location: ROUTES.PAGES.SIGN_IN})
        return ''
    },
    POST: (client) => {
        client.res.writeHead(STATUS_CODES.FORBIDDEN, {'Content-Type': MIME_TYPES.JSON})
        return generateError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.UNAUTHORIZED_ACCESS)
    }
}

const sessionType = {
    // Restrictions while user in system
    string: [
        {route: ROUTES.GENERAL.SIGN_IN, method: 'GET', handler: userInSystemHandler.GET},
        {route: ROUTES.GENERAL.SIGN_IN, method: 'POST', handler: userInSystemHandler.POST},
        {route: ROUTES.GENERAL.SIGN_UP, method: 'GET', handler: userInSystemHandler.GET},
        {route: ROUTES.GENERAL.SIGN_UP, method: 'POST', handler: userInSystemHandler.POST}    
    ],
    // Restrictions while user not in system
    undefined: [
        {route: ROUTES.API.FIND_USER, method: 'GET', handler: userNotInSystemHandler.GET},
        {route: ROUTES.API.FIND_TASKS, method: 'GET', handler: userNotInSystemHandler.POST},
        {route: ROUTES.API.CREATE_TASK, method: 'POST', handler: userNotInSystemHandler.POST},
        {route: ROUTES.API.UPDATE_TASK, method: 'PUT', handler: userNotInSystemHandler.POST},
        {route: ROUTES.API.DELETE_TASK, method: 'DELETE', handler: userNotInSystemHandler.POST},
        {route: ROUTES.API.SIGN_OUT, method: 'DELETE', handler: userNotInSystemHandler.POST},
        {route: ROUTES.PAGES.MAIN, method: 'GET', handler: userNotInSystemHandler.GET}
    ]
}

const securityPatch = (fn) => async (client) => {
    const { req, sessionID } = client
    const restrictions = sessionType[typeof sessionID]

    const restriction = restrictions.find(item => item.route === req.url && item.method === req.method)
    if (restriction) {
        const handler = restriction['handler']
        return handler(client)
    }

    return await fn(client)
}

module.exports = securityPatch