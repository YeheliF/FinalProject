module.exports = {
    ensureAuth: function (req,res,next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req,res,next) {
        if (req.isAuthenticated()){
            console.log("LLLLLLLL")
            res.redirect('/login')
        } else{
            return next()
        }
    },
}