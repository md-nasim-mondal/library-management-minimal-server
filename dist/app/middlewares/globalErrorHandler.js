"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';
    let errorResponse = {
        message: err.message,
        name: err.name,
    };
    // Handle Mongoose Validation Error
    if (err instanceof mongoose_1.Error.ValidationError) {
        statusCode = 400;
        message = 'Validation failed';
        errorResponse = {
            name: 'ValidationError',
            errors: {},
        };
        Object.keys(err.errors).forEach((key) => {
            var _a, _b;
            const error = err.errors[key];
            errorResponse.errors[key] = {
                message: error.message,
                name: error.name,
                properties: Object.assign(Object.assign({ message: error.message, type: error.kind }, (error.kind === 'min' && { min: (_a = error.properties) === null || _a === void 0 ? void 0 : _a.min })), (error.kind === 'max' && { max: (_b = error.properties) === null || _b === void 0 ? void 0 : _b.max })),
                kind: error.kind,
                path: error.path,
                value: error.value,
            };
        });
    }
    // Handle Mongoose Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        errorResponse = {
            name: 'CastError',
            message: `Invalid ${err.path}: ${err.value}`,
        };
    }
    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
        const field = Object.keys(err.keyValue)[0];
        errorResponse = {
            name: 'MongoServerError',
            message: `${field} already exists`,
            code: 11000,
        };
    }
    res.status(statusCode).json({
        message,
        success: false,
        error: errorResponse,
    });
};
exports.default = globalErrorHandler;
