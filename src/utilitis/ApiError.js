class ApiError extends Error
{
    constructor(statusCode,message='Something went wrong',errors=[])
    {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = statusCode<400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export {ApiError}