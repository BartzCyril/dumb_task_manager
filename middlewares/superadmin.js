const admin = (req, res, next) => {
    if (!req.session.isSuperAdmin) {
        return res.status(403).redirect('/');
    }

    next();
}

module.exports = admin;