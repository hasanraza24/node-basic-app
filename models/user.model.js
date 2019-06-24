var mongoose = require('../config/dbconnection');
var bcrypt = require('bcryptjs');
var createError = require('http-errors');
var mail = require('../helper/mail-service');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
    },
    verificationCode: {
        type: String
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
            const isPassMatch = await bcrypt.compare(password, authUser.password);
            if(!isPassMatch) {
                const err = createError(401, 'Password does not match');
                throw err;
            }
            return authUser;
        }catch(e) {
            return Promise.reject(e);
        }
    },
    async forgotPwd(email) {
        try {
            const user = await this.findOne({ email }).lean();
            if(!user) {
                throw createError(404, 'User not found!');
            }
            let str = Date.now().toString()
            const verCode = str.substring(str.length - 5);
            await this.findOneAndUpdate({ email }, { $set: { verificationCode: verCode } });
            user.verCode = verCode;
            await mail.sendMail(user)
            return;
        }catch(e) {
            return Promise.reject(e);
        }
    },
    async resetPassword({ email, verCode, password }) {
        try {
            const user = await this.findOne({ email }).lean();
            if(!user) {
                throw createError(404, 'User not found!');
            }
            console.log('User', user.verificationCode);
            console.log('ver', verCode);
            if(user.verificationCode !== verCode) {
                throw createError(400, 'Wrong verification code');
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const hasedPassword = hash;
            await this.findOneAndUpdate({ email }, { $set: { password: hasedPassword } });
            return;
        }catch(e) {
            return Promise.reject(e);
        }
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;