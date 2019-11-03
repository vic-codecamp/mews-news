const moment = require("moment");
const axios = require("axios");

const getLatestNewsItems = async function(db, username) {
  const newsItems = await db.newsItemsGetLatest();
  for (const newsItem of newsItems) {
    newsItem.label = "1";
    newsItem.voteUp = false;
    newsItem.voteDown = false;
    newsItem.publishedAtSince = moment(newsItem.publishedAt).fromNow();
  }

  if (!(newsItems.length && username)) {
    return newsItems;
  }

  // update newsItems with user input
  const userActions = await db.actionsGetByUserId(username);
  const userActionMap = {};

  for (const userAction of userActions) {
    userActionMap[userAction.newsItemId] = userAction;
  }

  for (const newsItem of newsItems) {
    const userAction = userActionMap[newsItem._id];
    if (userAction) {
      const action = userAction.action;
      if (action === "2") {
        newsItem.voteUp = true;
      } else if (action === "0") {
        newsItem.voteDown = true;
      }
    }
  }

  //
  // sort newsItems by priority
  //

  const response = await axios.post("http://localhost:7070/api/votes", newsItems);
  const newsItemsLabelled = response.data; // should be ordered

  const newsItemPriorityMap = { "2": [], "1": [], "0": [] };

  for (const newsItemLabelled of newsItemsLabelled) {
    newsItemPriorityMap[newsItemLabelled.vote + ""].push(newsItemLabelled);
  }

  const result = []
    .concat(newsItemPriorityMap["2"])
    .concat(newsItemPriorityMap["1"])
    .concat(newsItemPriorityMap["0"]);

  return result;
};

const getLoggableRenderData = function(renderData) {
  return { ...renderData, newsItemsCount: renderData.newsItems ? renderData.newsItems.length : -1, newsItems: null };
};

module.exports = {
  getLatestNewsItems,
  getLoggableRenderData
};
