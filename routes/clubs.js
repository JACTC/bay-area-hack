const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth")

const verify_club = require("../middleware/auth_club")

const { activityValidation, clubValidation } = require('../middleware/clubvalidation')

const { createactivity, createClub, getAllClubs } = require('../controller/club')


router.post('/activity/create', verifyToken, verify_club, activityValidation, createactivity)

router.post('/register', verifyToken, clubValidation, createClub)

router.get('/clubs', getAllClubs)



module.exports = router