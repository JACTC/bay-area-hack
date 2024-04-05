const express = require("express");
const router = express.Router();


const verifyToken = require("../middleware/auth");



const { nameValidation, passwordvalidation } = require("../middleware/uservalidation")

const { updateName, updatePassword, deleteAccount, getUsers, userProfile, uploadAvatar, getAvatar } = require("../controller/user");


router.patch('/update/name', verifyToken, nameValidation, updateName)

router.patch('/update/password', verifyToken, passwordvalidation, updatePassword)

router.delete('/delete', verifyToken, deleteAccount)

router.get('/users', getUsers) // TEST REMOVE BEFORE PRODUCTION!

router.get('/profile/:id', userProfile)

router.post('/update/avatar', verifyToken, uploadAvatar)

router.get('/avatar/:id', getAvatar)


module.exports = router