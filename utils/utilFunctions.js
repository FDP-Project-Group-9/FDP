exports.throwError = (message, status) => {
    const error = new Error();
    error.msg = message;
    error.status = status;
    throw error;
};