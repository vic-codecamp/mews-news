const {
  createDatastore,
  ensureIndexAsync,
  insertAsync,
  findOneAsync,
  findAsync,
  removeAsync,
  countAsync
} = require("./nedb-util");

module.exports = function(ic) {
  let dbNews = null;
  let dbActions = null;

  return {
    init: function() {
      dbNews = createDatastore("news");

      dbActions = createDatastore("actions");

      return ensureIndexAsync(dbNews, { fieldName: "url", unique: true }).then(() => {
        return ensureIndexAsync(dbNews, { fieldName: "publishedAt" });
      });

      /*
        .then(() => {
          return ensureIndexAsync(dbClicks, { fieldName: "userId" });
        });
        */
    },

    newsItemAdd: function(objNewsItem) {
      return insertAsync(dbNews, objNewsItem);
    },

    newsItemGetByUrl: function(url) {
      return findOneAsync(dbNews, { url });
    },

    newsItemRemoveById: function(id) {
      return removeAsync(dbNews, { _id: id });
    },

    newsItemsGetLatest: function(skip = 0, limit = 100) {
      return findAsync(dbNews, {}, { publishedAt: -1 }, skip, limit);
    }

    /*
    linkRemoveTestLinks: function() {
      return removeAsync(dbLinks, { test: { $exists: "true" } }).then(num1 => {
        return removeAsync(dbLinks, { link: "test" }).then(num2 => {
          return num1 + num2;
        });
      });
    },

    linkCount: function() {
      return countAsync(dbLinks, {});
    },

    clickAdd: function(objClick) {
      return insertAsync(dbClicks, objClick);
    },

    clickCount: function() {
      return countAsync(dbClicks, {});
    },

    clickRemoveTestClicks: function() {
      return removeAsync(dbClicks, { test: { $exists: "true" } });
    }
    */
  };
};
