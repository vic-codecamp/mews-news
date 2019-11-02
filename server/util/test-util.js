const supertest = require("supertest");
const Chance = require("chance");
const moment = require("moment");

const configuration = require("../config");
const MewsHttpServer = require("../routes/MewsHttpServer");
const DbNeDB = require("../db/DbNeDB");

const chance = new Chance();

const dbTestSetup = function() {
  return configuration.init().then(ic => {
    return ic;
  });
};

const routeTestSetup = async function() {
  const ic = await configuration.init();
  const db = new DbNeDB(ic);
  await db.init();
  const httpServer = new MewsHttpServer(ic, db);
  const server = httpServer.listen(9001);
  const url = "http://localhost:9001";
  const request = supertest(url);
  return { ic, server, request, url, db };
};

const routeTestTeardown = async function(server, db) {
  await cleanUpDb(db);
  server.close();
};

const login = function(ic, request) {
  return request
    .post("/login")
    .type("form")
    .send({ username: ic.appUsername, password: ic.appPassword });
};

const getRandomActionObj = function({ userId, url, title, action }) {
  return {
    userId: userId || chance.guid(),
    url: url || chance.url({}),
    title: title || chance.sentence({}),
    action: action || chance.natural({ min: 0, max: 2 }),
    when: moment().unix(),
    test: true
  };
};

const cleanUpDb = async function(db) {
  const numActionsRemoved = await db.actionRemoveTestActions();
};

module.exports = {
  chance,
  dbTestSetup,
  routeTestSetup,
  routeTestTeardown,
  login,
  cleanUpDb,
  getRandomActionObj
};
