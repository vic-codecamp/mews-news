const express = require("express");
const helmet = require("helmet");
const mustacheExpress = require("mustache-express");
const moment = require("moment");
const session = require("express-session");
const SessionFileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");

const { middlewareSetMimeTypeTextHtml } = require("./middleware");
const auth = require("./auth");
const { getLatestNewsItems, getLoggableRenderData, saveUserAction } = require("./route-util");

/*
const linkSchema = require("../schemas/link");
const { generateShortLink } = require("../util/link-util");
*/

const wrap = fn =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

class MewsHttpServer {
  constructor(ic, db) {
    ic.logger.info("Mews server running in " + ic.env);

    const lastUpdated = moment.unix(ic.lastUpdated).fromNow();

    const globalRenderData = {
      lastUpdated,
      version: ic.version
    };

    const sessionOptions = {
      secret: ic.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3 * 3600 * 1000 }
    };

    if (ic.env === "development") {
      ic.logger.info("sticky sessions for development");
      sessionOptions.store = new SessionFileStore({});
    }

    const server = express();

    server.engine("mst", mustacheExpress());
    server.set("view engine", "mst");
    server.set("views", path.join(__dirname, "..", "views"));

    server.use(helmet());

    server.use(session(sessionOptions));
    server.use(bodyParser.urlencoded({ extended: true }));

    server.use(passport.initialize());
    server.use(passport.session());
    server.use(flash());

    auth(ic);

    server.use(function(req, res, next) {
      req.renderData = { ...globalRenderData, username: null };

      if (req.user) {
        req.renderData.username = req.user.username;
      }

      next();
    });

    /*
    const middlewareStats = function(req, res, next) {
      try {
        getStats(db)
          .then(stats => {
            req.renderData = { ...req.renderData, ...stats };
            next();
          })
          .catch(err => {
            next(err);
          });
      } catch (err) {
        next(err);
      }
    };
    */

    //
    // index
    //

    //
    // get the main page
    // in case there was a login attempt, display a notification (due to redirection)
    //
    server.get(
      "/",
      middlewareSetMimeTypeTextHtml,
      /* middlewareStats,*/ wrap(async function(req, res) {
        const errorMessage = req.flash("error")[0];
        if (errorMessage) {
          req.renderData.notification = { message: errorMessage, type: "error" };
        } else {
          req.flash("error", "");
        }

        req.renderData.newsItems = await getLatestNewsItems(db, req.renderData.username);

        console.log(getLoggableRenderData(req.renderData));
        res.render("index", { ...req.renderData });
      })
    );

    //
    // - check if user logged in
    //
    server.post(
      "/",
      middlewareSetMimeTypeTextHtml,
      // middlewareStats,
      wrap(async function(req, res) {
        // console.log(req.body);

        if (req.renderData.username) {
          await saveUserAction(db, req.body.newsItemId, req.body.action, req.renderData.username);

          // TODO: cycle through funny messages as an easter egg
          req.renderData.notification = { message: "Every vote counts!", type: "success" };
        } else {
          req.renderData.notification = { message: "You must be logged in to perform this action!", type: "error" };
        }

        req.renderData.newsItems = await getLatestNewsItems(db, req.renderData.username);

        console.log(getLoggableRenderData(req.renderData));
        res.render("index", { ...req.renderData });
      })
    );

    //
    // profile
    //

    /*
    server.get("/links", middlewareSetMimeTypeTextHtml, function(req, res) {
      if (!req.renderData.username) {
        res.redirect("/");
        return;
      }

      // TODO: populate links

      console.log(req.renderData);
      res.render("links", { ...req.renderData });
    });
    */

    //
    // auth
    //

    server.post(
      "/login",
      passport.authenticate("local", { successRedirect: "/", failureRedirect: "/", failureFlash: true })
    );

    server.get("/logout", function(req, res) {
      req.logout();
      res.redirect("/");
    });

    //
    // public
    //

    server.use(express.static("public"));

    //
    // 404
    //

    server.use(function(req, res) {
      res.status(404).send();
    });

    if (ic.env === "production") {
      // no stack traces in production
      server.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send("Something broke!");
      });
    }

    this.server = server;
  }

  listen(port) {
    return this.server.listen(port);
  }

  getServer() {
    return this.server;
  }
}

/*
const shortenLink = async function(ic, db, linkObj) {
  linkObj.shortLink = await generateShortLink(ic.appUrl, db);
  const doc = await db.linkAdd(linkObj);
  return doc;
};

const getStats = async function(db) {
  return {
    numLinks: await db.linkCount(),
    numClicks: await db.clickCount()
  };
};
*/

module.exports = MewsHttpServer;
