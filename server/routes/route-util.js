const moment = require("moment");
const axios = require("axios");

const getLatestNewsItems = async function(db, username, textClassificationService) {
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

  await enhanceNewsItemsWithUserInput(db, newsItems, username);
  const newsItemsSorted = await sortNewsItemsByLabels(newsItems, textClassificationService);

  return newsItemsSorted;
};

async function enhanceNewsItemsWithUserInput(db, newsItems, username) {
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
}

async function sortNewsItemsByLabels(newsItems, textClassificationService) {
  let newsItemsLabelled = [];

  if (textClassificationService) {
    newsItemsLabelled = textClassificationService.addPredictions(newsItems);
  } else {
    const response = await axios.post("http://localhost:7070/api/votes", newsItems);
    newsItemsLabelled = response.data; // should be ordered
  }

  // console.log(newsItemsLabelled);

  const newsItemPriorityMap = { "2": [], "1": [], "0": [] };

  for (const newsItemLabelled of newsItemsLabelled) {
    if (newsItemLabelled.vote === "") {
      newsItemLabelled.vote = "1";
    }

    if (newsItemLabelled.vote + "" === "0") {
      newsItemLabelled.voteStr = "low";
    } else if (newsItemLabelled.vote + "" === "2") {
      newsItemLabelled.voteStr = "high";
    }

    newsItemPriorityMap[newsItemLabelled.vote + ""].push(newsItemLabelled);
  }

  const result = []
    .concat(newsItemPriorityMap["2"])
    .concat(newsItemPriorityMap["1"])
    .concat(newsItemPriorityMap["0"]);

  return result;
}

const getLoggableRenderData = function(renderData) {
  return { ...renderData, newsItemsCount: renderData.newsItems ? renderData.newsItems.length : -1, newsItems: null };
};

const saveUserAction = async function(db, newsItemId, action, username, textClassificationService) {
  const { _id, url, title, description } = await db.newsItemGetById(newsItemId);

  const actionObj = {
    userId: username,
    newsItemId: _id,
    url,
    title,
    description,
    action,
    when: moment().unix()
  };

  await db.actionRemoveByNewsItemId(_id);
  await db.actionAdd(actionObj);

  if (textClassificationService) {
    // TODO:
  } else {
    const voteObj = { username, title, vote: action };
    // console.log(voteObj);
    const response = await axios.post("http://localhost:7070/api/vote", voteObj);
    // console.log(response.data);
  }
};

module.exports = {
  getLatestNewsItems,
  getLoggableRenderData,
  saveUserAction
};
