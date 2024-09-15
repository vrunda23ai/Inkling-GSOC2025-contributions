const users = require('../../models/user.model.js');
const { hashPassword, comparePassword, generateTokenAndSetCookie } = require('../../utils');

async function signup(req, res) {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: 'Insufficient data' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await users.findOne({ username: username })
        if (user) {
            return res.status(400).json({ error: "username already exist" })
        }

        const boyProfliePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfliePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const hashedPassword = await hashPassword(password);

        const newUser = new users({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfliePic : girlProfliePic
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id , res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic
            });
        }
        else{
            return res.status(400).json({error: "Invalid user data"});
        }
    } catch (err) {
        console.log("Error in signup controller",err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

async function login(req, res) {
    try{
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Insufficient data' });
        }

        const isUserExist = await users.findOne({username});
        if(isUserExist){
            const isPasswordCorrect = await comparePassword(password, isUserExist.password);
            
            if(isPasswordCorrect){
                generateTokenAndSetCookie(isUserExist._id, res);
                return res.status(200).json({
                    _id: isUserExist._id,
                    username: isUserExist.username,
                    fullName: isUserExist.fullName,
                    profilePic: isUserExist.profilePic
                })
            }
            else{
                return res.status(400).json({ error: 'Invalid username or password' });
            }
        }
        else{
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

async function logout(req, res) {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out succesfully"});
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

module.exports = { signup, login, logout }