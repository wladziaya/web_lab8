const db = {
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'admin'
}

const STATUS_CODES = {
    OK: 200,
    FOUND: 302,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

const MIME_TYPES = {
    HTML: 'text/html; charset=utf-8',
    JS: 'text/javascript; charset=utf-8',
    CSS: 'text/css; charset=utf-8',
    JSON: 'application/json; charset=utf-8',
}

const SIGN_IN_ROUTE = '/users/signin'
const SIGN_UP_ROUTE = '/users/signup'
const TASK_OPERATIONS_ROUTE = '/tasks'

const ROUTES = {
    PAGES: {
        MAIN: '/',
        SIGN_IN: SIGN_IN_ROUTE,
        SIGN_UP: SIGN_UP_ROUTE,
    },
    ASSETS: {
        CSS: '/frontend/css',
        JS: '/frontend/js',
    },
    API: {
        SIGN_IN: SIGN_IN_ROUTE,
        SIGN_UP: SIGN_UP_ROUTE,
        SIGN_OUT: '/users/signout',
        FIND_USER: '/users',
        FIND_TASKS: TASK_OPERATIONS_ROUTE,
        CREATE_TASK: TASK_OPERATIONS_ROUTE,
        UPDATE_TASK: TASK_OPERATIONS_ROUTE,
        DELETE_TASK: TASK_OPERATIONS_ROUTE,
        // API_OPERATIONS_WITH_TASK: '/tasks',
    },
    GENERAL: {
        SIGN_IN: SIGN_IN_ROUTE,
        SIGN_UP: SIGN_UP_ROUTE,
        TASK: TASK_OPERATIONS_ROUTE
    }
}

const LOGS_FILEPATH = './logs/main_log.txt'

module.exports = { 
    db,
    STATUS_CODES ,
    MIME_TYPES,
    ROUTES,
    LOGS_FILEPATH
 }