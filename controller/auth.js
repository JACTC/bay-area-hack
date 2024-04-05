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

    const { fullName, email, password, } = req.body;

    const verifyEmail = await db.users.findOne({ where: { email: email } })
    try {
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })
        } else {

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
                        message: 'User successfully created!',
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

    const { email, password } = req.body

    let getUser

    await db.users.findOne({ where: { email: email } }).then((user) => {
        if (!user) {

            return res.status(401).json({
                message: "Authentication Failed",
            })

        }

        getUser = user

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
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    accessToken: jwtToken,
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


const validateToken = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true
    })
})


module.exports = {
    register,
    login,
    validateToken
}