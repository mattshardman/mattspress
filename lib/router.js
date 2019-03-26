const micro = require("micro");

const router = async (req, res, middleware) => {
  if(req.method === 'POST') {
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
  if (type === req.method && route === req.url) {
    cb(req, res, next);
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

    if (!called) {
      throw "Middleware must call next()";
    }

    return acc;
  }, null);
}

module.exports = { router, routeHandler };
