const UserController = require("../controller");
const restana = require("restana")();

const router = restana.newRouter();
const userController = new UserController();


router.get('/', userController.index)
      .get('/:id', userController.getById)
      .put('/:id', userController.update)
      .put('/:id/updatepassword', userController.updatePassword)
      .delete('/:id', userController.delete)
      .post('/register', userController.register)
      .post('/login', userController.login)
      .get('/logout/:id', userController.logout);

//

module.exports = router;