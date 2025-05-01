const map = new Map();

module.exports = {
  add: id => map.set(id, 0),
  updateProgress: (id, p) => map.set(id, p),
  getProgress: id => map.get(id)
};