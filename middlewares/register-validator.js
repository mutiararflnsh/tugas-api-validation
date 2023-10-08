const {body} = require("express-validator");
const { USERS } = require("../items");

const registerValidator = [
    body("fullName")
    .notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email")
    .notEmpty().withMessage("Email tidak boleh kosong")
    .isEmail().withMessage("Email tidak valid")
    .custom(value => {
        const existingUser = USERS.find(user => user.email === value);
        if (existingUser) {
          throw new Error('Email already registered');
        }
        return true;
    }),
    body("password")
    .notEmpty().withMessage("Password tidak boleh kosong")
    .isLength( { min: 8, max: 15 } ).withMessage("Password minimal 8 karakter dan maksimal 15 karakter")
    .isStrongPassword( {minSymbols: 1} ).withMessage("Password harus mengandung 1 simbol"),
    body("bio")
    .isString().withMessage("Bio harus berupa string"),
    body("dob")
    .notEmpty().withMessage("Date of Birth tidak boleh kosong")
    .isDate("YYYY-MM-DD").withMessage("Date of Birth harus berformat YYYY-MM-DD")
];

module.exports = registerValidator;