const jwt = require('jsonwebtoken');

function checkValidityofTheToken(req, res, next) {
    const authHeader = req.hearers['Authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null){
        res.status(401)
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.status(403)
        }

        req.user = user;

        next();
    })
}

module.exports = { checkValidityofTheToken }