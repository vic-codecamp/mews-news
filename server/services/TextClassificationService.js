const natural = require("natural");

module.exports = class TextClassificationService {
  constructor(ic, db) {
    this.ic = ic;
    this.db = db;

    this.classifier = new natural.BayesClassifier();
  }

  addDocument(title, label) {
    this.classifier.addDocument(title, label);
  }

  train() {
    this.classifier.train();
  }

  addPredictions(newsItems) {
    for (const newsItem of newsItems) {
      const label = this.classifier.classify(newsItem.title);
      // console.log(label);
      newsItem.vote = label;
    }
    return newsItems;
  }
};
