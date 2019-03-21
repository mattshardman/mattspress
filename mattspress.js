const http = require("http");
const micro = require("micro");

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

      this.requestSwitch(req, res);
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

  middleWareReducer(req, res) {
    this.middleware.reduce((acc, mw, i) => {
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

  async requestSwitch(req, res) {
    const gets = Object.entries(this.gets);
    const posts = Object.entries(this.posts);

    switch (req.method) {
      case "GET":
        try {
          this.middleWareReducer(req, res);
        } catch (e) {
          return console.log(e);
        }
        gets.forEach(([route, cb]) => {
          if (route === req.url) {
            cb(req, res);
          }
        });
        break;

      case "POST":
        const body = await micro.json(req);
        req.body = body;
        try {
          this.middleWareReducer(req, res);
        } catch (e) {
          return console.log(e);
        }

        posts.forEach(([route, cb]) => {
          if (route === req.url) {
            cb(req, res);
          }
        });
        break;
    }
  }
}

module.exports = Mattspress;
