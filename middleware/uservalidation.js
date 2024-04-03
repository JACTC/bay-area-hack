
const nameValidation = async (req, res, next) => {

    try {
        const { fullName } = req.body

        if (fullName && fullName.length > 2) {
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


const passwordvalidation = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (password && password.length > 5 && password.length < 21) {
            next();
        } else {
            return res.status(412).send({
                success: false,
                message: 'Password validation failed',
            });
        }
    } catch (error) {
        return res.status(412).send({
            success: false,
            message: 'Password validation failed',
        });
    }
}


module.exports = {
    nameValidation,
    passwordvalidation
}