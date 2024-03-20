
const regsiterValidation = async (req, res, next) => {

    try {

        const { fullName, email, password } = req.body
        // .lenght dosent work
        if (fullName && fullName[2] && email && email.includes('@') && email.includes('.') && password && password[5] && !password[20]) {
            next()
        } else {
            return res.status(412).send({
                success: false,
                message: 'Validation failed'
            })
        }
    } catch (error) {
    }




}

const loginValidation = async (req, res, next) => {

    try {
        if (req.body.email && req.body.email.includes('@') && req.body.email.includes('.') && req.body.password && req.body.password[5] && !req.body.password[20]) {
            next()
        } else {
            return res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: validateRule
            })
        }
    } catch (error) {

    }
}

module.exports = {
    regsiterValidation,
    loginValidation
}