import Joi from "joi";
import REGEX_PATTERNS from "./regex_patterns.js";

export const registerValidation = (data) => {
    const schema = Joi.object({
        channelName: Joi.string()
            .min(3)
            .required()
            .messages({
                "string.base": "Channel name must be a string.",
                "string.min": "Channel name must be at least 3 characters long.",
                "any.required": "Channel name is required.",
            }),
        phoneNumber: Joi.string()
            .pattern(REGEX_PATTERNS.phoneNumber)
            .required()
            .messages({
                "string.pattern.base": "Phone number format is invalid.",
                "any.required": "Phone number is required.",
            }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.email": "Please provide a valid email address.",
                "any.required": "Email is required.",
            }),
        password: Joi.string()
            .pattern(REGEX_PATTERNS.password)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must be at least 8 characters long and contain both letters and numbers.",
                "any.required": "Password is required.",
            }),
    });

    return schema.validate(data, { abortEarly: false }); // Return all errors at once
};

export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.email": "Please provide a valid email address.",
                "any.required": "Email is required.",
            }),
        password: Joi.string()
            .pattern(REGEX_PATTERNS.password)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must be at least 8 characters long and contain both letters and numbers.",
                "any.required": "Password is required.",
            }),
    });

    return schema.validate(data, { abortEarly: false }); // Return all errors at once
};


export const videoValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .required()
            .messages({
                "string.base": "Title must be a string.",
                "string.min": "Title must be at least 3 characters long.",
                "any.required": "Title is required.",
            }),
        description: Joi.string()
            .min(10)
            .required()
            .messages({
                "string.base": "Description must be a string.",
                "string.min": "Description must be at least 10 characters long.",
                "any.required": "Description is required.",
            }),
        category: Joi.string()
            .valid(
                "Education",
                "Entertainment",
                "Music",
                "Sports",
                "News",
                "Technology"
            )
            .required()
            .messages({
                "any.only": 'Category must be one of the following: "Education", "Entertainment", "Music", "Sports", "News", or "Technology".',
                "any.required": "Category is required.",
            }),
        tags: Joi.array()
            .items(Joi.string())
            .required()
            .messages({
                "array.base": "Tags must be an array of strings.",
                "any.required": "Tags are required.",
            }),
    });

    return schema.validate(data, { abortEarly: false }); // Return all errors at once
};