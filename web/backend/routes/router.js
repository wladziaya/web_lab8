const { ROUTING } = require('./index')

const ASSETS_ROUTE_INDEX = 1

const router = req => {
    const methodRoutes = ROUTING.get(req.method)
    const handler = methodRoutes.get(req.url)
    if (handler) return handler

    const matchResult = req.url.match(/(\/frontend\/(css|js))\/\w+.(css|js)/) 
    if (matchResult) return methodRoutes.get(matchResult[ASSETS_ROUTE_INDEX])

    return
}

module.exports = router