const express = require("express");
const router = express.Router();


const verifyToken = require("../middleware/auth")

const verify_club = require("../middleware/auth_club")

const verify_activity = require("../middleware/auth_activity")


const { activityValidation, clubValidation } = require('../middleware/clubvalidation')

const { createactivity, createClub, getRandomClubs, getActivity, getAllActivities, updateActivityName, updateActivityDescription, updateClubName, updateClubDescription, updateClubAdmins, removeClubAdmins, addActivityOrganizers, removeActivityOrganizers, getClub, uploadLogo, getLogo } = require('../controller/club')




router.post('/register', verifyToken, clubValidation, createClub)

router.get('/club/:id', getClub)

router.get('/club/logo/:id', getLogo)

router.patch('/club/update/logo/:id', verifyToken,(req, res, next)=>{req.body.club = req.params.id; next()} ,verify_club, uploadLogo)

router.patch('/club/update/name', verifyToken, verify_club, updateClubName)

router.patch('/club/update/description', verifyToken, verify_club, updateClubDescription)

router.patch('/club/update/addAdmins', verifyToken, verify_club, updateClubAdmins)

router.patch('/club/update/removeAdmins', verifyToken, verify_club, removeClubAdmins)



router.get('/activities/:id', getActivity)

router.post('/activity/create', verifyToken, verify_club, activityValidation, createactivity)

router.patch('/activity/update/name', verifyToken, verify_activity, updateActivityName)

router.patch('/activity/update/description', verifyToken, verify_activity, updateActivityDescription)

router.patch('/activity/addOrganizers', verifyToken, verify_activity, addActivityOrganizers)

router.patch('/activity/removeOrganizers', verifyToken, verify_activity, removeActivityOrganizers)



router.get('/clubs/activities', getAllActivities) // TEST

router.get('/clubs', getRandomClubs)// TEST



module.exports = router