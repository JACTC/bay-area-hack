const express = require('express')
//Importing the JWT package
const jwt = require('jsonwebtoken')
//Importing the bcrypt package
const bcrypt = require('bcryptjs')
//Imprtong the user model 
const db = require('../models')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
    //Destructuing the inputs from req.body 
    const { fullName, email, password, } = req.body;

    //Verifying the email address inputed is not used already 
    const verifyEmail = await db.users.findOne({ where: { email: email } })
    try {
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })
        } else {
            //using bcrypt to hash the password sent from the user
            const hash = await bcrypt.hash(req.body.password, 10)

            const user = {
                name: fullName,
                email: email,
                password: hash,
                role: 'user',
                status: 'unverified',
                clubs: []
            }

            await db.users.create(user)
                .then((response) => {
                    return res.status(201).json({
                        message: 'user successfully created!',
                        success: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        error: error,
                    })
                })
        }

    } catch (error) {
        return res.status(412).send({
            success: false,
            message: error.message
        })
    }

})

const login = asyncHandler(async (req, res) => {
    //Destructing the inputs from req.body
    const { email, password } = req.body

    //created a variable to assign the user
    let getUser

    //verifying that the user with the email exist or not
    await db.users.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
            //if user does not exist responding Authentication Failed
            return res.status(401).json({
                message: "Authentication Failed",
            })

        }
        //assigned the user to getUser variable
        getUser = user
        /*
    Then compare the password from the req.body and the hased password on the database 
    using the bcrypt.compare built in function
    */
        return bcrypt.compare(password, user.password)

    })
        .then((response) => {
            if (!response) {
                return res.status(401).json({
                    message: "Authentication Failed"
                })
            } else {
                let jwtToken = jwt.sign(
                    {
                        email: getUser.email,
                        userId: getUser.userId,
                        role: getUser.role
                    },
                    //Signign the token with the JWT_SECRET in the .env
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    accessToken: jwtToken,

                    //I like to send the userId of the user that loggedin in order to fetch his data and dispaly
                    userId: getUser.userId,
                })

            }

        })
        .catch((err) => {
            return res.status(401).json({
                messgae: err.message,
                success: false
            })
        })
})

const userProfile = asyncHandler(async (req, res, next) => {

    //Destructing id from the req.params
    const { id } = req.params;

    try {
        //verifying if the user exist in the database
        const verifyUser = await db.users.findOne({ where: { userId: id } })
        if (!verifyUser) {
            return res.status(403).json({
                message: "user not found",
                success: false,
            })
        } else {
            return res.status(200).json({
                name: verifyUser.name,
                activities: verifyUser.activities,
                success: true
            })
        }
    }
    catch (error) {
        return res.status(401).json({
            sucess: false,
            message: error.message,
        })
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await db.users.findAll();
    return res.status(200).json({
        users: users,
        success: true
    })
})


module.exports = {
    register,
    login,
    userProfile,
    getUsers
}