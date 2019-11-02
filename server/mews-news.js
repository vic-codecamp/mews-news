const configuration = require("./config");

const MewsHttpServer = require("./routes/MewsHttpServer");
const DbNeDB = require("./db/DbNeDB");
const NewsApiService = require("./services/NewsApiService");

// TODO: logo

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      const newsApiService = new NewsApiService(ic, db);
      await newsApiService.init();

      const server = new MewsHttpServer(ic, db);
      server.listen(ic.httpPort);
      ic.logger.info("MewsHttpServer listening on " + ic.httpPort);
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());
