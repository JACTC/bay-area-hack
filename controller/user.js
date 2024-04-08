const express = require('express')

const db = require('../models')

const bcrypt = require('bcryptjs')

const asyncHandler = require("express-async-handler");

const multer = require('multer');

const path = require('path')

const fs = require('fs')


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


const updatePassword = asyncHandler(async (req, res, next) => {
    try {
        const user = await db.users.findOne({ where: { userId: req.userData.userId } })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'No user found',
            })
        }

        const { password } = req.body
        const hash = await bcrypt.hash(password, 10)

        await user.update({ password: hash }, { where: { userId: req.userData.userId } })
        
        return res.status(201).json({
            message: 'Password successfully updated!',
            success: true
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


    const { id } = req.params;

    try {

        const verifyUser = await db.users.findOne({ where: { userId: id } })
        if (!verifyUser) {
            return res.status(403).json({
                message: "user not found",
                success: false,
            })
        } else {
            return res.status(200).json({
                name: verifyUser.name,
                clubs: verifyUser.clubs,
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



const getAvatar = asyncHandler(async (req, res) => {
    const avatarName = `${req.params.id}.png`;
    var avatarPath = path.join(__dirname, '../files', avatarName);

    
    if (!avatarName || avatarName.indexOf('..') > -1) {
        res.status(403).send({
            success: false,
            message: 'Unauthorized',
        })
    }


    fs.access(avatarPath, fs.constants.F_OK, (err) => {
        if (err) {
            avatarPath = path.join(__dirname, '../files', 'user.png');
        }

    
        res.sendFile(avatarPath);
    });
});



const uploadAvatar = asyncHandler(async (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'files/');
        },
        filename: (req, file, cb) => {
            cb(null, req.userData.userId + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage });

    upload.single('avatar')(req, res, async (err) => {
        if (err) {
            return res.status(415).json({
                success: false,
                message: 'Invalid file type. Only images are allowed.',
            });
        }

        try {
            await fs.promises.rename(
                path.join(__dirname, `../files/${req.file.filename}`),
                path.join(__dirname, `../files/${req.userData.userId}.png`)
            );
            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    });

})







module.exports = {
    updateName,
    userProfile,
    updatePassword,
    deleteAccount,
    getUsers,
    uploadAvatar,
    getAvatar
}