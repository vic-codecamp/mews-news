var brain = require("brain.js");

module.exports = class TextClassificationCredulousService {
  constructor(ic, db) {
    this.ic = ic;
    this.db = db;

    this.inputs = [];
    this.net = new brain.recurrent.LSTM();
  }

  addDocument(title, label) {
    this.inputs.push({ input: title, output: label });
  }
  
  train() {
    this.net.train(this.inputs, { log: true, errorThresh: 0.1 });
  }

  addPredictions(newsItems) {
    for (const newsItem of newsItems) {
      const label = this.net.run(newsItem.title);
      // console.log(label);
      newsItem.vote = label;
    }
    return newsItems;
  }
};
