const super_admin = (req, res, next) => {
    if (req.user.status != 1)
        return res.status(403).send('Murojaat rad etildi');
    next();
}

module.exports.super_admin = super_admin