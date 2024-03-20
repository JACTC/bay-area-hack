const jwt = require("jsonwebtoken");
const db = require('../models')
module.exports = (req, res, next) => {
    try {
        if ( req.userData.roles == 'admin'){
            next()
        }else{
            return res.status(403).json({
                message: "Unauthorised"
            });
        }
    } catch (err) {
        return res.status(401).json({
            message: "Authentification Failed"
        });
    }
};