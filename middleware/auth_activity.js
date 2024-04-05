const jwt = require("jsonwebtoken");
const db = require('../models')
module.exports = (req, res, next) => {
  try {
    db.activities.findOne({ where: {activityId: req.body.activity}}).then( activity => {
      if(!activity){
        return res.status(412).json({
          success: false,
          message: 'Validation failed',
        })
      }else if(activity.organizers.includes(req.userData.userId)){
        return next();
      }else {
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
