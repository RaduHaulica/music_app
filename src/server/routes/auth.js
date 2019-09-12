const router = require('express').Router();

const User = require('../../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const TOKEN_SECRET = "topsecretcharsrighthere";

/**
 * /user/login
 */
router.post('/login', async (req, res) => {
    console.log("Call to /user/login made");

    //check if user exists in database
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("User not found in database");
    //check if password is correct
    const passwordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValid) return res.status(400).send("Password invalid");

    // create JWT
    const token = jwt.sign({_id: user._id}, TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send("Logged in");
});

/**
 * /user/register
 */
router.post('/register', async (req,res) => {
    console.log("Call to /user/register made");

    // check if user already exists
    const emailExists = await User.findOne({email: req.body.email===undefined?"testmail":req.body.email});
    if (emailExists) return res.status(400).send("Email already registered.");

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create the new User
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        console.log("New user saved.");
        res.send({user: user._id});
    } catch(err) {
        res.status(40).send(err);
    }
});

module.exports = router;