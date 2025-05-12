import Joi from "joi";
import REGEX_PATTERNS from "./regex_patterns";

const registerValidation = (data) => {
    const schema = Joi.object({
        channelName: Joi.string().min(3).required(),
        phone: Joi.string()
            .pattern(REGEX_PATTERNS.phoneNumber, { name: "phone", allow: true })
            .required(),
        email: Joi.string()
            .email({ tlds: { allow: false } }) // disable TLD check for dev
            .required(),
        password: Joi.string()
            .pattern(REGEX_PATTERNS.password)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must be at least 8 characters long and contain both letters and numbers.",
                "any.required": "Password is required.",
            }),
        logo: Joi.string().optional(),
    });

    return schema.validate(data);
};

export default registerValidation;
