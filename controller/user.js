const express = require('express')
//Imprtong the user model 
const db = require('../models')
//Importing the bcrypt package
const bcrypt = require('bcryptjs')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");


const updateName = asyncHandler(async (req, res, next) => {

    try {
        const { fullName } = req.body
        await db.users.update({ name: fullName }, { where: { userId: req.userData.userId } }).then((user) => {
            if (user[0] = 0) {
                return res.status(404).send({
                    success: false,
                    message: 'No user found',
                })
            } else {
                return res.status(201).json({
                    message: 'User successfully updated!',
                    success: true
                })
            }
        })
    } catch (error) {

    }

})

//update the password

const updatePassword = asyncHandler(async (req, res, next) => {
    try {
        const { password } = req.body
        const hash = await bcrypt.hash(password, 10)

        await db.users.update({ password: hash }, { where: { userId: req.userData.userId } })
            .then((user) => {
                if (user[0] = 0) {
                    return res.status(404).send({
                        success: false,
                        message: 'No user found',
                    })
                } else {
                    return res.status(201).json({
                        message: 'Password successfully updated!',
                        success: true
                    })
                }
            })
    } catch (error) {
        return res
            .status(500).json({
                success: false,
                message: error.message,
            })
    }
})



const deleteAccount = asyncHandler(async (req, res, next) => {
    try {
        await db.users.destroy({ where: { userId: req.userData.userId } }).then((user) => {

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No user found',
                })
            } else {
                return res.status(201).json({
                    message: 'Account successfully deleted!',
                    success: true
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
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
    updateName,
    userProfile,
    updatePassword,
    deleteAccount,
    getUsers
}