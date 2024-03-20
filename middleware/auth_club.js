const jwt = require("jsonwebtoken");
const db = require('../models')
module.exports = (req, res, next) => {
  try {
    db.clubs.findOne({ where: {clubId: req.body.club}}).then( club => {
      if(!club){
        return res.status(412).json({
          success: false,
          message: 'Validation failed',
        })
      }else if(club.admins.includes(req.userData.userId)){
        next();
      }else {
        return res.status(412).json({
          success: false,
          message: 'Validation failed',
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