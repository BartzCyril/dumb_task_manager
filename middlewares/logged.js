const logged = (req, res, next) => {
    if (!req.session || !req.session.userid) {
        return res.status(403).redirect('/auth/login');
    }

    next();
}

module.exports = logged;