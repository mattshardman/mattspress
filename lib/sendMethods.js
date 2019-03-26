const resSend = (input, res) => {
  res.writeHead(res.setStatus || 200, { "Content-Type": "text/plain" });
  res.end(input);
};

const resJson = (input, res) => {
  res.writeHead(res.setStatus || 200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(input));
};

module.exports = {
    resSend,
    resJson,
};