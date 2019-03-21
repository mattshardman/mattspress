const micro = require("micro");

const router = async (req, res, middlewareReducer, middleware, routes) => {
  const gets = Object.entries(routes[0]);
  const posts = Object.entries(routes[1]);

  switch (req.method) {
    case "GET":
      try {
        middlewareReducer(req, res, middleware);
      } catch (e) {
        return console.log(e);
      }
      gets.forEach(([route, cb]) => {
        if (route === req.url) {
          cb(req, res);
        } else {
          res.status(500);
          res.send(`Cannot send ${req.method} request to ${req.url}. Route does not exist`);
        }
      });
      break;

    case "POST":
      const body = await micro.json(req);
      req.body = body;
      
      try {
        middlewareReducer(req, res, middleware);
      } catch (e) {
        return console.log(e);
      }

      posts.forEach(([route, cb]) => {
        if (route === req.url) {
          cb(req, res);
        } else {
          res.status(500);
          res.send(`Cannot send ${req.method} request to ${req.url}. Route does not exist`);
        }
        
      });
      break;

    default:
      throw(`Failed`);
  }
};

module.exports = router;
