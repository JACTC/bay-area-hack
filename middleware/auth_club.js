const jwt = require("jsonwebtoken");
const db = require('../models')
module.exports = (req, res, next) => {
  try {
    if (!req.body.club) {
      return res.status(412).json({
        success: false,
        message: 'Validation failed',
      })
    }

    db.clubs.findOne({ where: { ClubId: req.body.club } }).then(club => {
      if (!club) {
        return res.status(412).json({
          success: false,
          message: 'Validation failed',
        })
      } else if (club.admins.includes(req.userData.userId)) {
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorised',
        })
      }

    })
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};