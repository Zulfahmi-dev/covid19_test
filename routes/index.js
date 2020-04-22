
const {UserRouter, UserController} =  require("../modules/user");

module.exports = (app) => {

    app.use('/user', UserRouter)
    // app.use('/screening', ScreeningRouter)
}