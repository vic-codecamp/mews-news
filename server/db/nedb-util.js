const Datastore = require("nedb");
const path = require("path");

const createDatastore = function(dbName) {
  return new Datastore({
    filename: path.join(__dirname, "..", "..", process.env.NODE_ENV === "test" ? `${dbName}.test.db` : `${dbName}.db`),
    autoload: true
  });
};

const ensureIndexAsync = function(db, indexObj) {
  return new Promise((resolve, reject) => {
    db.ensureIndex(indexObj, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const insertAsync = function(db, obj) {
  return new Promise((resolve, reject) => {
    try {
      db.insert(obj, function(err, newDoc) {
        if (err) {
          reject(err);
          return;
        }
        resolve(newDoc);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const findOneAsync = function(db, params) {
  return new Promise((resolve, reject) => {
    try {
      db.findOne(params, function(err, docFound) {
        if (err) {
          reject(err);
          return;
        }
        resolve(docFound);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const findAsync = function(db, params = {}, sortObj = {}, skip = null, limit = null) {
  return new Promise((resolve, reject) => {
    try {
      let findObj = db.find(params).sort(sortObj);

      if (skip !== null) {
        findObj = findObj.skip(skip);
      }

      if (limit !== null) {
        findObj = findObj.limit(limit);
      }

      findObj.exec(function(err, docFound) {
        if (err) {
          reject(err);
          return;
        }
        resolve(docFound);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const removeAsync = function(db, params) {
  return new Promise((resolve, reject) => {
    try {
      db.remove(params, { multi: true }, function(err, numRemoved) {
        if (err) {
          reject(err);
          return;
        }
        resolve(numRemoved);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const countAsync = function(db, params) {
  return new Promise((resolve, reject) => {
    try {
      db.count(params, function(err, num) {
        if (err) {
          reject(err);
          return;
        }
        resolve(num);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createDatastore,
  ensureIndexAsync,
  insertAsync,
  findOneAsync,
  findAsync,
  removeAsync,
  countAsync
};
