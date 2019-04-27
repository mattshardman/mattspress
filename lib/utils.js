const parseParams = (url, paramKey) => {
  const paramArray = url.split("/");
  const paramValue = paramArray[paramArray.length - 1];
  return { [paramKey]: paramValue };
};

module.exports = { parseParams };
