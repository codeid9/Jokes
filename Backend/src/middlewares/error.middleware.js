import ApiError from "../utils/ApiError.js";

const errorMiddleware = async (err, req, res, next) => {
    let error = err;

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new ApiError(400, message);
    }

    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ApiError(400, message);
    }

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(
            statusCode,
            message,
            error?.errors || [],
            err.stack,
        );
    }

    const response = {
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development"
            ? { stack: error.stack }
            : {}),
    };

    return res.status(error.statusCode).json(response);
};

export default errorMiddleware;
