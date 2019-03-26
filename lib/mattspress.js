const http = require("http");
const { resSend, resJson } = require("./sendMethods");
const { router, routeHandler } = require("./router");

class Mattspress {
  constructor() {
    this.requestHandler = async (req, res) => {
      res.status = input => (res.setStatus = input);
      res.send = input => resSend(input, res);
      res.json = input => resJson(input, res);

      try {
        router(req, res, this.middleware);
      } catch (e) {
        res.status(500);
        res.json({ error: e });
      }
    };

    this.middleware = [];
    this.server = http.createServer(this.requestHandler);
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  use(...middleWareFuncs) {
    middleWareFuncs.forEach(each => {
      if (typeof each == 'function') {     
        this.middleware.push(each);
      } else {
        each.routes.forEach(route => this.middleware.push(route));
      } 
    });

    this.middleware.forEach(each => {
      if (typeof each !== 'function') {
        throw 'Middleware must be functions';
      }
    });
  }

  addRouteToMiddleWare(route, url, cb) {
    this.middleware.push(routeHandler(route, url, cb));
  }

  get(url, cb) {
    this.addRouteToMiddleWare("GET", url, cb);
  }

  post(url, cb) {
    this.addRouteToMiddleWare("POST", url, cb);
  }

  put(url, cb) {
    this.addRouteToMiddleWare("PUT", url, cb);
  }

  delete(url, cb) {
    this.addRouteToMiddleWare("DELETE", url, cb);
  }
}

class CreateRouter extends Mattspress {
  constructor() {
    super();
    this.routes = [];
  }

  addRoute(route, url, cb) {
    this.routes.push(routeHandler("GET", url, cb));
  }

  get(url, cb) {
    this.addRoute("GET", url, cb);
  }

  post(url, cb) {
    this.addRoute("POST", url, cb);
  }

  put(url, cb) {
    this.addRoute("PUT", url, cb);
  }

  delete(url, cb) {
    this.addRoute("DELETE", url, cb);
  }
}

module.exports = { Mattspress, CreateRouter };
