const express = require('express')

const db = require('../models')

const asyncHandler = require("express-async-handler");

const multer = require('multer');

const path = require('path')

const fs = require('fs')



const createactivity = asyncHandler(async (req, res, next) => {
    const { name, description, organizers, club } = req.body

    const Club = await db.clubs.findOne({ where: { ClubId: club } })
    const user = await db.users.findOne({ where: { userId: organizers } })

    if (!Club || !user) {
        return res.status(412).send({
            success: false,
            message: 'Organizer or Club not found',
        })
    }

    db.activities.create({ name, description, organizers, club, status: 'unverified', users: [] }).then((response) => {
        Club.update({
            activities: [...Club.activities, response.activityId]
        })
        user.update({
            activities: [...user.activities, response.activityId]
        })

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

const addActivityOrganizers = asyncHandler(async (req, res, next) => {
    const { activityId, organizers } = req.body

    const activity = await db.activities.findOne({ where: { activityId: activityId } })
    if (!activity) {
        return res.status(412).send({
            success: false,
            message: 'Activity not found',
        })
    }


    for (const organizer of organizers) {
        const user = await db.users.findOne({ where: { userId: organizer } })
        if (!user || user.activities.includes(activityId) || activity.organizers.includes(organizer)) {
            continue
        }

        user.update({ activities: [...user.activities, activityId] })
        activity.update({ organizers: [...activity.organizers, organizer] })
    }


    return res.status(200).json({
        message: 'Activity organizers successfully updated!',
        success: true
    })
})

const removeActivityOrganizers = asyncHandler(async (req, res, next) => {
    const { activityId, organizers } = req.body

    const activity = await db.activities.findOne({ where: { activityId: activityId } })
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

    for (const organizer of organizers) {
        const user = await db.users.findOne({ where: { userId: organizer } })
        if (!user || !user.activities.includes(activityId) || !activity.organizers.includes(organizer)) {
            continue
        }

        user.update({ activities: user.activities.filter(activity => activity !== activityId) })
        activity.update({ organizers: activity.organizers.filter(organizer => organizer !== organizer) })
    }


    return res.status(200).json({
        message: 'Activity organizers successfully updated!',
        success: true
    })


})

const getActivity = asyncHandler(async (req, res, next) => {
    try {

        const activity = await db.activities.findOne({ where: { activityId: req.params.id } })


        if (! await activity) {
            return res.status(412).send({
                success: false,
                message: 'Activity not found',
            })
        }
            return res.status(200).json({
                message: 'Activity successfully retrieved!',
                name:  activity.name,
                description:  activity.description,
                organizers:  activity.organizers,
                club:  activity.club,
                users:  activity.users,
                success: true
            })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'An error occurred',
        })
    }

})

const createClub = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body

    const admins = [req.userData.userId]

    db.clubs.create({ name, description, admins, status: 'unverified', activities: [] }).then((response) => {

        db.users.findOne({ where: { userId: req.userData.userId } }).then((user) => {

            if (!user) {
                return res.status(412).send({
                    success: false,
                    message: 'Validation failed',
                })
            }

            var clb = user.clubs
            clb.push(response.ClubId)
            db.users.update({ clubs: clb }, { where: { userId: req.userData.userId } }).then(() => {
                return res.status(201).json({
                    message: 'Club successfully created!',
                    club: response.ClubId,
                    success: true
                })
            })

        })
    })

})

const updateClubName = asyncHandler((req, res, next) => {
    const { club, name } = req.body

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

    for (const admin of admins) {
        const user = await db.users.findOne({ where: { userId: admin } })
        if (!user || user.clubs.includes(club) || Club.admins.includes(admin)) {
            continue
        }
        user.update({ clubs: [...user.clubs, club] })
        Club.update({ admins: [...Club.admins, admin] })
    }
    return res.status(200).json({
        message: 'Club admins successfully updated!',
        success: true
    })

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

    for (const admin of admins) {
        const user = await db.users.findOne({ where: { userId: admin } })
        if (!user || !user.clubs.includes(club) || !Club.admins.includes(admin)) {
            continue
        }
        user.update({ clubs: user.clubs.filter(club => club !== club) })
        Club.update({ admins: Club.admins.filter(admin => admin !== admin) })
    }

    return res.status(200).json({
        message: 'Club admins successfully removed!',
        success: true
    })

})

const getClub = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

    const Club = await db.clubs.findOne({ where: { ClubId: id } })
    if (!Club) {
        return res.status(412).send({
            success: false,
            message: 'Club not found',
        })
    }

    return res.status(200).json({
        message: 'Club successfully retrieved!',
        clubId: Club.ClubId,
        name: Club.name,
        description: Club.description,
        admins: Club.admins,
        activities: Club.activities,
        createdAt: Club.createdAt,
        success: true
    })
})

const getRandomClubs = asyncHandler((req, res, next) => {

    const clubs_promise = db.clubs.findAll();

    clubs_promise.then((clubs) => {
        if (clubs.length < 3) {
            return res.status(200).json({
                message: 'Clubs successfully retrieved!',
                clubs: clubs,
                success: true
            })
        }

        let randomClubs = [];
        while (randomClubs.length < 3) {
            const randomIdx = Math.floor(Math.random() * clubs.length);
            const club = clubs[randomIdx];

            if (!randomClubs.some(c => c.ClubId === club.ClubId)) {
                randomClubs.push(club);
            }
        }

        return res.status(200).json({
            message: 'Clubs successfully retrieved!',
            clubs: randomClubs,
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

const getLogo = asyncHandler(async (req, res) => {
    const avatarName = `${req.params.id}.png`;

    if (!avatarName || avatarName.indexOf('..') > -1) {
        res.status(403).send({
            success: false,
            message: 'Unauthorized',
        })
    }

    var avatarPath = path.join(__dirname, '../files/clubs/logos', avatarName);

    fs.access(avatarPath, fs.constants.F_OK, (err) => {
        if (err) {
            avatarPath = path.join(__dirname, '../files/clubs/logos', 'user.png');
        }

        res.sendFile(avatarPath);
    });
});


const uploadLogo = asyncHandler(async (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'files/clubs/logos');
        },
        filename: (req, file, cb) => {
            cb(null, req.params.id + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage });

    upload.single('logo')(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(415).json({
                success: false,
                message: 'Invalid file type. Only images are allowed.',
            });
        }

        try {
            await fs.promises.rename(
                path.join(__dirname, `../files/clubs/logos/${req.file.filename}`),
                path.join(__dirname, `../files/clubs/logos/${req.params.id}.png`)
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
    createactivity,
    createClub,
    getActivity,
    getRandomClubs,
    getAllActivities,
    updateActivityName,
    updateActivityDescription,
    updateClubName,
    updateClubDescription,
    updateClubAdmins,
    removeClubAdmins,
    addActivityOrganizers,
    removeActivityOrganizers,
    getClub,
    getLogo,
    uploadLogo
}
