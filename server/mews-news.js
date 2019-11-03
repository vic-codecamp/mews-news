const configuration = require("./config");

const MewsHttpServer = require("./routes/MewsHttpServer");
const DbNeDB = require("./db/DbNeDB");
const NewsApiService = require("./services/NewsApiService");
const TextClassificationService = require("./services/TextClassificationService");
const TextClassificationCredulousService = require("./services/TextClassificationCredulousService");
const TextClassificationBrainJsService = require("./services/TextClassificationBrainJsService");

// TODO: logo

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      const newsApiService = new NewsApiService(ic, db);
      await newsApiService.init();

      const textClassificationService = null;
      /*
      const textClassificationService = new TextClassificationBrainJsService(ic, db);
      const actions = await db.actionsGetByUserId(ic.appUsername);

      if (actions.length) {
        for (const action of actions) {
          textClassificationService.addDocument(action.title, action.action);
        }

        textClassificationService.train();
      } else {
        textClassificationService.addDocument("trump", "1");
        textClassificationService.addDocument("bitcoin", "1");
        // textClassificationService.addDocument("cricket", "0");
        // textClassificationService.addDocument("climate", "2");
      }
      */

      const server = new MewsHttpServer(ic, db, textClassificationService);
      server.listen(ic.httpPort);
      ic.logger.info("MewsHttpServer listening on " + ic.httpPort);
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());
