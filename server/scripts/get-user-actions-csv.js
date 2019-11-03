const path = require("path");
const ObjectsToCsv = require("objects-to-csv");

const configuration = require("../config");
const DbNeDB = require("../db/DbNeDB");

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      const userActions = await db.actionsGetByUserId(ic.appUsername);
      const data = [];
      for (const userAction of userActions) {
        data.push({ username: userAction.userId, title: userAction.title, action: userAction.action });
      }
      const csv = new ObjectsToCsv(data);
      await csv.toDisk(path.join(__dirname, "..", "..", "content", "history.csv"));
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());
