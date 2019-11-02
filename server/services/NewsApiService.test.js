/*
const { expect } = require("chai");

const DbNeDB = require("../db/DbNeDB");
const NewsApiService = require("./NewsApiService");
const testUtil = require("../util/test-util");

describe("NewsApiService", () => {
  let db = null;
  let newsApiService = null;

  before(async function() {
    const ic = await testUtil.dbTestSetup();
    db = DbNeDB(ic);
    await db.init();
    newsApiService = new NewsApiService(ic, db);
  });

  after(async function() {
    await testUtil.cleanUpDb(db);
  });

  describe("getHeadlines()", function() {
    it("should get headlines", async function() {
      // when
      const response = await newsApiService.getHeadlines();

      // then
      expect(response.length).to.be.above(0);
    });
  });
});
*/