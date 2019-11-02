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
    init: async function() {
      dbNews = createDatastore("news");

      dbActions = createDatastore("actions." + ic.appUsername);

      await ensureIndexAsync(dbNews, { fieldName: "url", unique: true });
      await ensureIndexAsync(dbNews, { fieldName: "publishedAt" });
      await ensureIndexAsync(dbActions, { fieldName: "newsItemId", unique: true });

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

    newsItemGetById: function(_id) {
      return findOneAsync(dbNews, { _id });
    },

    newsItemRemoveById: function(id) {
      return removeAsync(dbNews, { _id: id });
    },

    newsItemsGetLatest: function(skip = 0, limit = 100) {
      return findAsync(dbNews, {}, { publishedAt: -1 }, skip, limit);
    },

    actionAdd: function(actionObj) {
      return insertAsync(dbActions, actionObj);
    },

    actionsGetByUserId: function(userId) {
      return findAsync(dbActions, { userId });
    },

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
    */

    actionRemoveByNewsItemId: function(newsItemId) {
      return removeAsync(dbActions, { newsItemId });
    },

    actionRemoveTestActions: function() {
      return removeAsync(dbActions, { test: { $exists: "true" } });
    }
  };
};
