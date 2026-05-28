const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require('../models/User');
const generateToken = require('../utils/generateToken');


// @desc Authenticate with google
// @route POST /api/auth/google
// @access public
exports.googleLogin = async (req, res, next) => {

    const { idToken, onboardingData } = req.body;

    try {
        // token verification sent from the mobile app
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: avatarUrl } = payload;

        let user = await User.findOne({
            $or: [{ googleId }, {
                email
            }]
        })

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                avatarUrl,
                goal: onboardingData?.goal || 'general_health',
                barrier: onboardingData?.barrier || 'time',
                age: onboardingData?.age ? Number(onboardingData.age) : 25,
                gender: onboardingData?.gender || 'other',
                weight: onboardingData?.weight ? Number(onboardingData.weight) : 70,
                height: onboardingData?.height ? Number(onboardingData.height) : 170,
                activityLevel: onboardingData?.activityLevel || 'sedentary'
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            if (avatarUrl) user.avatarUrl = avatarUrl;
            await user.save();
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
            activityLevel: user.activityLevel,
            goal: user.goal,
            avatarUrl: user.avatarUrl,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(401);
        next(new Error('Google verification failed: ' + error.message));
    }

}




//@desc register a new user
//@route POST /api/auth/signup
//@access public    
exports.signupUser = async (req, res, next) => {


    const { name, email, password, goal, barrier, age, gender,
        weight, height, activityLevel } = req.body;

    try {

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }


        // 2. We inject all 9 pieces of data directly into the database
        const user = await User.create({
            name, email, password, age, gender,
            weight, height, activityLevel, goal, barrier
        });

        if (user) {
            res.status(201).json({
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                height: user.height,
                weight: user.weight,
                gender: user.gender,
                activityLevel: user.activityLevel,
                goal: user.goal,
                token: generateToken(user._id),

            })
        } else {
            res.status(400);
            throw new Error('invalid user data');
        }
    } catch (error) {
        next(error);
    }
}

//@desc Authenticate user & get token
//@route POST api/auth/login
//@access Public

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                weight: user.weight,
                height: user.height,
                activityLevel: user.activityLevel,
                goal: user.goal,
                token: generateToken(user._id),
            })
        } else {
            res.status(401);
            throw new Error('invalid email or password');
        }

    } catch (error) {
        next(error)
    }
};

//@desc Logout user
//@route POST /api/auth/logout
//@access Public
exports.logoutUser = (req, res) => {
    res.status(200).json({
        message: 'logged out successfully'
    })
}


exports.getMe = async (req, res, next) => {

    try {
        //we do this so only logged in users can see their personal data
        // we do this to know who's data we are going to return, this is the importance of the protect middleware
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({

                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                weight: user.weight,
                height: user.height,
                activityLevel: user.activityLevel,

            })
        } else {
            res.status(404);
            throw new Error('user is not found');
        }
    } catch (error) {
        next(error)
    }

}

//@desc Update user profile
//@route PUT /api/auth/profile
//@access Private

exports.updateUserProfile = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }

        user.age = req.body.age || user.age;
        user.weight = req.body.weight || user.weight;
        user.height = req.body.height || user.height;
        user.gender = req.body.gender || user.gender;
        user.activityLevel = req.body.activityLevel || user.activityLevel;
        user.goal = req.body.goal || user.goal;

        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            age: updatedUser.age,
            weight: updatedUser.weight,
            height: updatedUser.height,
            gender: updatedUser.gender,
            activityLevel: updatedUser.activityLevel,
            goal: updatedUser.goal,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        next(error);
    }

}