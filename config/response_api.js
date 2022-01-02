
exports.success = (message, results, statusCode, res) => {
    return res.status(statusCode).json({
        message,
        error: false,
        code: statusCode,
        data: results
    });
};


exports.error = (message, statusCode, res) => {
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];

    const findCode = codes.find((code) => code == statusCode);

    if (!findCode) statusCode = 500;
    else statusCode = findCode;
    return res.status(statusCode).json({
        message,
        code: statusCode,
        error: true
    });
};
