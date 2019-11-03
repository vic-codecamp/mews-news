
const ObjectsToCsv = require("objects-to-csv");

const configuration = require("../config");
const DbNeDB = require("../db/DbNeDB");

function main() {
  configuration
    .init()
    .then(async ic => {
      const db = new DbNeDB(ic);
      await db.init();

      
    })
    .catch(err => {
      console.error(err);
    });
}

Promise.resolve(main());