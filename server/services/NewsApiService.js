const axios = require("axios");

module.exports = class NewsApiService {
  constructor(ic, db) {
    this.ic = ic;
    this.db = db;
  }

  async init() {
    const fn = async () => {
      try {
        const newsItems = await this.getHeadlines();
        // console.log(newsItems);
        await this.saveNewsItems(newsItems);
      } catch (err) {
        this.ic.logger.error(err);
      }
    };

    // run at start in prod mode
    if (this.ic.env === "production") {
      await fn();
    }

    this.interval = setInterval(async () => {
      fn();
    }, 15 * 1000 * 10); // run every x minutes
  }

  async getHeadlines() {
    // free developer account is limited to 100 results
    const url = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${this.ic.newsApiKey}&pageSize=100`;
    this.ic.logger.debug(url);

    const response = await axios.get(url);
    return response.data.articles;
  }

  async saveNewsItems(newsItems) {
    for (const newsItem of newsItems) {
      const found = await this.db.newsItemGetByUrl(newsItem.url);
      if (!found) {
        await this.db.newsItemAdd(newsItem);
      }
    }
  }
};
