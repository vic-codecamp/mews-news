# mews-news

A personalized news feed using Node.js &amp; Nedb (a file-based Mongodb API compatible db).

Before starting mews-news, make sure that you copy `.env.dist` to `.env` and fill in the configuration as desired.

## tech stack

`mews-news` is fully server-side rendered web application powered by Node.js. The following is a selection of the modules in use:

- express webserver
- session handling via session-file-store, a simple file-based session storage
- passport authentication
- moustache templating

## development

```bash
$ cp .env.dist .env
$ npm install
$ npm run sass:build
$ npm i -g nodemon
$ npm run sass:watch
$ npm run server:stat:dev
```

## production

```bash
$ cp .env.dist .env
$ npm install
$ npm run sass:build
$ npm run server:start
```

## TODO

- logo
- backend
- credits
