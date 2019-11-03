var Credulous = require("credulous");

module.exports = class TextClassificationCredulousService {
  constructor(ic, db) {
    this.ic = ic;
    this.db = db;

    this.model = new Credulous({ labels: ["0", "1", "2"] });
  }

  addDocument(title, label) {
    this.model.train(title, label);
  }

  addPredictions(newsItems) {
    for (const newsItem of newsItems) {
      const label = this.model.classify(newsItem.title);
      // console.log(label);
      newsItem.vote = label;
    }
    return newsItems;
  }
};
