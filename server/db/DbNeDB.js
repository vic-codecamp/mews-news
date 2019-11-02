const {
  createDatastore,
  ensureIndexAsync,
  insertAsync,
  findOneAsync,
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

      return ensureIndexAsync(dbNews, { fieldName: "url", unique: true });

      /*
      .then(() => {
        return ensureIndexAsync(dbClicks, { fieldName: "shortLink" });
      });
      */

      /*
        .then(() => {
          return ensureIndexAsync(dbClicks, { fieldName: "userId" });
        });
        */
    }

    /*
    linkAdd: function(objLink) {
      return insertAsync(dbLinks, objLink);
    },

    linkGetByShortLink: function(shortLink) {
      return findOneAsync(dbLinks, { shortLink });
    },

    linkRemoveById: function(id) {
      return removeAsync(dbLinks, { _id: id });
    },

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
