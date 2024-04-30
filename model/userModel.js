const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'] },
    role: { type: Number, default: 0 },
    otp: { type: String },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    totalSpent: { type: Number, default: 0 }
});

const saltRounds = 10;

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        user.password = hashedPassword;
        next();
    });
});

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
