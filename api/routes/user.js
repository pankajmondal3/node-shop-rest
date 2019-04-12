const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

//all user show
router.get('/userlist', checkAuth, UserController.get_all_userlist);

//signup user
router.post('/signup', UserController.user_signup);

//login user
router.post('/login', UserController.user_login)

//delete user
router.delete('/delete/:userId', checkAuth, UserController.user_delete)


//get user for show
router.get('/:userId', checkAuth, UserController.one_user_details_get)

//get user for edit
router.post('/edit/:userId', checkAuth, UserController.user_details_get)

//update user
router.put('/edit/:userId', checkAuth, UserController.user_update)

module.exports = router;