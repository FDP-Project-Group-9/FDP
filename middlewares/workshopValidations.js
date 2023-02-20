const { body } = require("express-validator");

exports.createWorkshopValidationRules = () => {
    return [
        body("user_id")
            .exists()
            .withMessage("User id is required!")
    ];
};
