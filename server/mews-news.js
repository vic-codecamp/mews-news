const configuration = require("./config");

const ShortyHttpServer = require("./routes/MewsHttpServer");
const DbNeDB = require("./db/DbNeDB");

// TODO: db integration - shorten, track clicks
// TODO: setup cache
// TODO: add tests
// TODO: logo

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      const server = new ShortyHttpServer(ic, db);
      server.listen(ic.httpPort);
      ic.logger.info("MewsHttpServer listening on " + ic.httpPort);
      
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());
