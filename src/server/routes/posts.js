const router = require('express').Router();
const verify = require('./verifyToken');

const User = require('../../models/user');

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: "my first post",
            description: "random data you shouldn't access"
        }
    });
});

router.get('/user/', verify, async (req,res) =>{
    const user = await User.findOne({_id: req.user._id});
    res.send(user);
});

module.exports = router;