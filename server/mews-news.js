const configuration = require("./config");

const MewsHttpServer = require("./routes/MewsHttpServer");
const DbNeDB = require("./db/DbNeDB");
const NewsApiService = require("./services/NewsApiService");
const TextClassificationService = require("./services/TextClassificationService");

// TODO: logo

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      const newsApiService = new NewsApiService(ic, db);
      await newsApiService.init();

      const textClassificationService = new TextClassificationService(ic, db);
      const actions = await db.actionsGetByUserId(ic.appUsername);

      if (actions.length) {
        for (const action of actions) {
          textClassificationService.addDocument(action.title, action.action);
        }
      } else {
        textClassificationService.addDocument("trump", "1");
        textClassificationService.addDocument("bitcoin", "1");
        textClassificationService.addDocument("cricket", "0");
        textClassificationService.addDocument("climate", "2");
      }

      const server = new MewsHttpServer(ic, db, textClassificationService);
      server.listen(ic.httpPort);
      ic.logger.info("MewsHttpServer listening on " + ic.httpPort);
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());
