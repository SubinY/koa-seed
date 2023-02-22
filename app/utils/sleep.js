module.exports = async function sleep(time = 300) {
  return new Promise((resolve) => setTimeout(resolve), time);
};
