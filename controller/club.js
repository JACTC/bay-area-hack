const express = require('express')

const db = require('../models')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");


const createactivity = asyncHandler((req, res, next) => {
    const { name, description, organizers, club } = req.body

    db.activities.create({ name, description, organizers, club }).then((response) => {
        return res.status(201).json({
            message: 'Activity successfully created!',
            id: response.activityId,
            club: response.club,
            success: true
        })
    })
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

const getAllClubs = asyncHandler((req, res, next) => {
    db.clubs.findAll().then((response) => {
        return res.status(200).json({
            message: 'Clubs successfully retrieved!',
            clubs: response
        })
    })
})

module.exports = {
    createactivity,
    createClub,
    getAllClubs
}
