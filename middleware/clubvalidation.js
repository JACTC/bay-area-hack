const db = require('../models')
const { Op } = require("sequelize");

const activityValidation = async (req, res, next) => {


    try {
        const { name, description, organizers, club } = req.body

        if (name, description, organizers, club) {

            db.clubs.findOne({ where: { clubId: club } }).then(club => {

                if (!club) {
                    return res.status(412).send({
                        success: false,
                        message: 'Validation failed',
                    })
                }
            })

            var organizerss = []

            organizers.forEach(element => {
                db.users.findOne({ where: { userId: element } }).then(user => {
                    if ( user && user.clubs.includes(club)) {
                        organizerss.push(user.userId)
                    }
                })

            }).then(() => {
                if (organizerss.length == 0) {
                    return res.status(412).send({
                        success: false,
                        message: 'Validation failed',
                    })
                } else {
                    req.body.organizers = organizerss
                    next()
                }
            })


        }
    } catch (error) {
        console.log(error)
        return res.status(412).send({
            success: false,
            message: 'Validation failed',
        })

    }


}

const clubValidation = async (req, res, next) => {


    try {
        const { name, description } = req.body

        if (name, description) {

            db.clubs.findOne({ where: { name: name } }).then(club => {
                if (!club) {
                    next()
                } else {
                    return res.status(412).send({
                        success: false,
                        message: 'Validation failed, club already exists',
                    })
                }
            })

        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'An error occurred',
        })

    }


}




module.exports = {
    activityValidation,
    clubValidation
}