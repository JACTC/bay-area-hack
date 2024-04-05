const express = require('express')

const db = require('../models')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");


const createactivity = asyncHandler((req, res, next) => {
    const { name, description, organizers, club } = req.body

    db.activities.create({ name, description, organizers, club, status:'unverified', users:[] }).then((response) => {
        return res.status(201).json({
            message: 'Activity successfully created!',
            id: response.activityId,
            club: response.club,
            success: true
        })
    })
})


const updateActivityName = asyncHandler((req, res, next) => {
    const { activityId, name } = req.body

    db.activities.update({ name }, { where: { activityId: activityId } }).then((response) => {
        if (response[0] === 1) {
            return res.status(200).json({
                message: 'Activity name successfully updated!',
                success: true
            })
        } else {
            return res.status(412).send({
                success: false,
                message: 'Activity not found',
            })
        }
    })
})




const updateActivityDescription = asyncHandler((req, res, next) => {
    const { activityId, description } = req.body

    db.activities.update({ description }, { where: { activityId: activityId } }).then((response) => {
        if (response[0] === 1) {
            return res.status(200).json({
                message: 'Activity description successfully updated!',
                success: true
            })
        } else {
            return res.status(412).send({
                success: false,
                message: 'Activity not found',
            })
        }
    })
})





const addActivityOrganizers = asyncHandler((req, res, next) => {
    const { activityId, organizers } = req.body

    db.activities.findOne({ where: { activityId: activityId } }).then((activity) => {
        if (!activity) {
            return res.status(412).send({
                success: false,
                message: 'Activity not found',
            })
        }

        activity.organizers = [...activity.organizers, ...organizers]

        db.activities.update({ organizers: activity.organizers }, { where: { activityId: activityId } }).then((response) => {
            if (response[0] === 1) {
                return res.status(200).json({
                    message: 'Activity organizers successfully updated!',
                    success: true
                })
            } 
        })
    })
})




const removeActivityOrganizers = asyncHandler((req, res, next) => {
    const { activityId, organizers } = req.body

    db.activities.findOne({ where: { activityId: activityId } }).then((activity) => {
        if (!activity) {
            return res.status(412).send({
                success: false,
                message: 'Activity not found',
            })
        }

        const remainingOrganizers = activity.organizers.filter(organizer => !organizers.includes(organizer))

        if (remainingOrganizers.length === 0) {
            return res.status(412).send({
                success: false,
                message: 'At least one organizer is required',
            })
        }

        db.activities.update({ organizers: remainingOrganizers }, { where: { activityId: activityId } }).then((response) => {
            if (response[0] === 1) {
                return res.status(200).json({
                    message: 'Activity organizers successfully updated!',
                    success: true
                })
            } 
        })
    })
})



const getActivity = asyncHandler((req, res, next) => {
    try {
        db.activities.findOne({where:{ club:req.params.id}}).then((response) => {
            return res.status(200).json({
                message: 'Activity successfully retrieved!',
                activities: response,
                success: true
            })
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'An error occurred',
        })
    }

})




const createClub = asyncHandler((req, res, next) => {
    const { name, description } = req.body

    const admins = [req.userData.userId]

    db.clubs.create({ name, description, admins, status: 'unverified', activities:[] }).then((response) => {
        
        db.users.findOne({ where: { userId: req.userData.userId } }).then((user) => {
            
            if (!user) {
                return res.status(412).send({
                    success: false,
                    message: 'Validation failed',
                })
            }
            
            var clb = user.clubs
            clb.push(response.ClubId)
            console.log(clb)
            db.users.update({ clubs: clb }, { where: { userId: req.userData.userId } }).then(() => {
                return res.status(201).json({
                    message: 'Club successfully created!',
                    club: response.clubId,
                    success: true
            })
        })

        })
    })

})



const updateClubName = asyncHandler((req, res, next) => {
    const { clubId: club, name } = req.body

    db.clubs.update({ name }, { where: { ClubId: club } }).then((response) => {
        if (response[0] === 1) {
            return res.status(200).json({
                message: 'Club name successfully updated!',
                success: true
            })
        } else {
            return res.status(412).send({
                success: false,
                message: 'Club not found',
            })
        }

    })

})



const updateClubDescription = asyncHandler((req, res, next) => {
    const { club, description } = req.body

    db.clubs.update({ description }, { where: { ClubId: club } }).then((response) => {
        if (response[0] === 1) {
            return res.status(200).json({
                message: 'Club description successfully updated!',
                success: true
            })
        } else {
            return res.status(412).send({
                success: false,
                message: 'Club not found',
            })
        }

    })

})




const updateClubAdmins = asyncHandler(async (req, res, next) => {
    const { club, admins } = req.body

    const Club = await db.clubs.findOne({ where: { ClubId: club } })
    if (!Club) {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

    const updatedAdmins = [...new Set([...club.admins, ...admins])]

    const response = await db.clubs.update({ admins: updatedAdmins }, { where: { ClubId: club } })

    if (response[0] === 1) {
        return res.status(200).json({
            message: 'Club admins successfully updated!',
            success: true
        })
    } else {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

})



const removeClubAdmins = asyncHandler(async (req, res, next) => {
    const { clubId: club, admins } = req.body

    const Club = await db.clubs.findOne({ where: { ClubId: club } })
    if (!Club) {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

    const updatedAdmins = Club.admins.filter(admin => !admins.includes(admin))

    if (updatedAdmins.length === 0) {
        return res.status(412).send({
            success: false,
            message: 'At least one admin is required',
        })
    }

    const response = await db.clubs.update({ admins: updatedAdmins }, { where: { ClubId: club } })

    if (response[0] === 1) {
        return res.status(200).json({
            message: 'Club admins successfully removed!',
            success: true
        })
    } else {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

})




const getAllClubs = asyncHandler((req, res, next) => {
    db.clubs.findAll().then((response) => {
        return res.status(200).json({
            message: 'Clubs successfully retrieved!',
            clubs: response,
            success: true
        })
    })
})

const getAllActivities = asyncHandler((req, res, next) => {
    db.activities.findAll().then((response) => {
        return res.status(200).json({
            message: 'Activities successfully retrieved!',
            activities: response,
            success: true
        })
    })
})

module.exports = {
    createactivity,
    createClub,
    getActivity,
    getAllClubs,
    getAllActivities,
    updateActivityName,
    updateActivityDescription,
    updateClubName,
    updateClubDescription,
    updateClubAdmins,
    removeClubAdmins,
    addActivityOrganizers,
    removeActivityOrganizers
}
