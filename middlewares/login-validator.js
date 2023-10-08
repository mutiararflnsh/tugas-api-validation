const { body } = require("express-validator");

const loginValidator = [
    body("email")
    .notEmpty().withMessage("Email tidak boleh kosong")
    .isEmail().withMessage("Email tidak valid"),
    body("password")
    .notEmpty().withMessage("Password tidak boleh kosong")
    .isLength( { min: 8, max: 15 } ).withMessage("Password minimal 8 karakter dan maksimal 15 karakter")
    .isStrongPassword( {minSymbols: 1} ).withMessage("Password harus mengandung 1 simbol"),
];

module.exports = loginValidator;