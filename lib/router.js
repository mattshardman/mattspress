const micro = require("micro");

const router = async (req, res, middleware) => {
  if (req.method === "POST" || req.method === "PUT") {
    const body = await micro.json(req);
    req.body = body;
  }

  try {
    middlewareReducer(req, res, middleware);
  } catch (e) {
    res.json({ error: e });
  }
};

const routeHandler = (type, route, cb) => (req, res, next) => {
  const [ paramRoute, param ] = route.split(":");
  const isParamRoute = route.includes(":");

  if (type === req.method && route === req.url) {

    cb(req, res, next);

  } else if (isParamRoute) {

    if(type === req.method && req.url.includes(paramRoute)) {

      const paramArray = req.url.split('/');
      const paramValue = paramArray[paramArray.length -1]
      req.params = { [param]: paramValue };

      cb(req, res, next);
    }
  } else {
    next();
  }
};

const middlewareReducer = (req, res, middleware) => {
  middleware.reduce((acc, mw, i) => {
    let called = false;
    const next = input => {
      called = true;
      if (input) {
        acc = input;
      }
    };

    mw(req, res, next, acc);

    return acc;
  }, null);
};

module.exports = { router, routeHandler };
