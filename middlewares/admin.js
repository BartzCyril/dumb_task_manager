const admin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).redirect('/');
    }

    next();
}

module.exports = admin;