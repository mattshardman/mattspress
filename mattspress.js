const http = require("http");

const router = require('./router');

class Mattspress {
  constructor() {
    this.requestHandler = async (req, res) => {
      res.status = input => (res.setStatus = input);
      res.send = input => {
        res.writeHead(res.setStatus || 200, { "Content-Type": "text/plain" });
        res.end(input);
      };
      res.json = input => {
        res.writeHead(res.setStatus || 200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(input));
      };

      router(req, res, this.middleWareReducer, this.middleware, [this.gets, this.posts]);
    };

   

    this.middleware = [];
    this.gets = {};
    this.posts = {};
    this.server = http.createServer(this.requestHandler);
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  use(...middleWareFuncs) {
    middleWareFuncs.forEach(each => {
      this.middleware.push(each);
    });
  }

  get(url, cb) {
    this.gets = { ...this.gets, [url]: cb };
  }

  post(url, cb) {
    this.posts = { ...this.gets, [url]: cb };
  }

  middleWareReducer(req, res, middleware) {
    middleware.reduce((acc, mw, i) => {
      let called = false;

      const next = input => {
        if (input) {
          acc[i] = input;
        }
        called = true;
      };

      mw(req, res, next, acc);

      if (!called) {
        throw "Middleware must call next()";
      }

      return acc;
    }, []);
  }
}

module.exports = Mattspress;
