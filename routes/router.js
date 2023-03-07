const app = require("express");
const router = app.Router();

const {test, loginUser} =require("../controllers/loginController")

router.get('/login', test)
router.post('/login', loginUser)

module.exports = router;