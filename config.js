const db = {
    host: process.env.CLEARDB_HOST || 'localhost',
    user: process.env.CLEARDB_USER || 'root',
    database: process.env.CLEARDB_DATABASE_NAME || 'test',
    password: process.env.CLEARDB_PASSWORD || 'йгощкшьщ'
}

const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
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
    },
    GENERAL: {
        SIGN_IN: SIGN_IN_ROUTE,
        SIGN_UP: SIGN_UP_ROUTE,
        TASK: TASK_OPERATIONS_ROUTE
    }
}

const LOGS_FILEPATH = './logs/main_log.txt'

const CANNOT_OPERATE_TASK = operation => {
    return `Can't ${operation} task: task doesn't exist or you don't have rights to ${operation} it`
}

const ERROR_MESSAGES = {
    EMPTY_REQUEST_BODY: 'Get no JSON data from request body',
    NO_SUCH_USER: 'User not found',
    INCORRECT_PASSWORD: 'Incorrect password',
    CANNOT_UPDATE_TASK: CANNOT_OPERATE_TASK('update'),
    CANNOT_DELETE_TASK: CANNOT_OPERATE_TASK('delete'),
    RESTRICTION_FOR_AUTHORIZED_USERS: 'User can`t do this while being authorized',
    UNAUTHORIZED_ACCESS: 'User must be authorized to perform such actions',
}

module.exports = { 
    db,
    STATUS_CODES ,
    MIME_TYPES,
    ROUTES,
    LOGS_FILEPATH,
    ERROR_MESSAGES
 }