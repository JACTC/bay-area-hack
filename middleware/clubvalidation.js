const db = require('../models')
const { Op, STRING } = require("sequelize");
const { use } = require('../routes/clubs');

const activityValidation = async (req, res, next) => {


    try {
        const { name, description, club } = req.body

        if (name, description, club) {

            db.clubs.findOne({ where: { clubId: club } }).then(club => {

                if (!club) {
                    return res.status(412).send({
                        success: false,
                        message: 'Validation failed',
                    })
                }
            })
            console.log(typeof name)
            if (typeof name == 'string' && typeof description == 'string') {
                req.body.organizers = req.userData.userId
                next()
            } else {
                return res.status(412).send({
                    success: false,
                    message: 'Validation failed',
                })
            }

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