const { Mattspress, CreateRouter } = require("./lib/mattspress");
const { router, routeHandler } = require("./lib/router");

const mattspress = () => new Mattspress();

const Router = () => new CreateRouter();

exports = module.exports = mattspress;
exports.Router = Router;
