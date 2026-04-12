const User = require('../models/User');
const generateToken = require('../utils/generateToken');


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