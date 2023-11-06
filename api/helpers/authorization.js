const ResHelper = require(_pathconst.FilesPath.ResHelper);
exports.authorize = async function (req, res, next) {
    try {
        if (!req.header('Authorization')) {
            return ResHelper.apiResponse(res, false, "Make sure you have the Authorization header", 401, {});
        }
        var token = req.header('Authorization');

        if(token == '#%$silver4Life#$&') next()
        else return ResHelper.apiResponse(res, false, "Unauthorized source", 401, {});
    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error With the request", 401, {});
    }
}