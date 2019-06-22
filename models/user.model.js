var mongoose = require('../config/dbconnection');
var bcrypt = require('bcryptjs');
var createError = require('http-errors');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        index: {
            unique: true
        },
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//pre save hook for validation
userSchema.post('save', (err, res, next) => {
    if (err.code === 11000) {
      const error = createError(400, 'User already exist');
      return next(error);
    }
    return next(err);
  });

userSchema.statics = {
    async create(userBody) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(userBody.password, salt);
            userBody.password = hash;
            const user = new this(userBody);
            return await user.save();
        }catch(e) {
            return Promise.reject(e);
        }
    },
    async login({ email, password }) {
        try {
            const authUser = await this.findOne({ email: email }).lean();
            if(!authUser) {
                const err = createError(404, 'User not found');
                throw err;
            }
            console.log('AuthUser', authUser);
            const isPassMatch = await bcrypt.compare(password, authUser.password);
            if(!isPassMatch) {
                const err = createError(401, 'Password does not match');
                throw err;
            }
            return authUser;
        }catch(e) {
            return Promise.reject(e);
        }
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;