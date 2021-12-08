class ApiError {
    code: number; message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(400, message);
    }

    static internalServerError(message) {
        return new ApiError(500, message);
    }

    static notFound(message) {
        return new ApiError(404, message);
    }

    static unauthorized(message) {
        return new ApiError(401, message);
    }
}

export default ApiError;