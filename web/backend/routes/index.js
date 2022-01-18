const AssetsController = require('../controllers/assets_controller')
const UserController = require('../controllers/user_controller')
const TaskController = require('../controllers/task_controller')

const { ROUTES } = require('../config')

const assetsController = new AssetsController()
const userController = new UserController()
const taskController = new TaskController()

const GET_ROUTES = new Map([
    [ROUTES.PAGES.MAIN, async (client) => assetsController.getMainPage(client)],
    [ROUTES.API.FIND_USER, async (client) => userController.findById(client)],
    [ROUTES.PAGES.SIGN_IN, async (client) => assetsController.getSignInPage(client)],
    [ROUTES.PAGES.SIGN_UP, async (client) => assetsController.getSignUpPage(client)],
    [ROUTES.API.FIND_TASKS, async (client) => taskController.findAll(client)],
    [ROUTES.ASSETS.CSS, async (client) => assetsController.getCSSFile(client)],
    [ROUTES.ASSETS.JS, async (client) => assetsController.getJSFile(client)]
])

const POST_ROUTES = new Map([
    [ROUTES.API.SIGN_IN, async (client) => userController.signIn(client)],
    [ROUTES.API.SIGN_UP, async (client) => userController.signUp(client)],
    [ROUTES.API.CREATE_TASK, async (client) => taskController.create(client)] 
])

const PUT_ROUTES = new Map([
    [ROUTES.API.UPDATE_TASK, async (client) => taskController.update(client)]
])

const DELETE_ROUTES = new Map([
    [ROUTES.API.SIGN_OUT, async (client) => userController.signOut(client)],
    [ROUTES.API.DELETE_TASK, async (client) => taskController.delete(client)]
])

const ROUTING = new Map([
    ['GET', GET_ROUTES],
    ['POST', POST_ROUTES],
    ['PUT', PUT_ROUTES],
    ['DELETE', DELETE_ROUTES]
])

module.exports = { ROUTING }