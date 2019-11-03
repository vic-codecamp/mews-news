# mews-news

A personalized news feed using Node.js &amp; Nedb (a file-based Mongodb API compatible db).

Before starting mews-news, make sure that you copy `.env.dist` to `.env` and fill in the configuration as desired.

## tech stack

`mews-news` is fully server-side rendered web application powered by Node.js. The following is a selection of the modules in use:

- express webserver
- session handling via session-file-store, a simple file-based session storage
- passport authentication
- moustache templating

## machine learning

### server

```bash
cd content
python3 -m pip install --user --upgrade pip
python3 -m pip install --user virtualenv
# python3 -m venv mews-news
source mews-news/bin/activate

pip install flask pandas wheel sklearn
python ./server.py
```

endpoints samples:

vote a title:

    curl -d '{"username":"user", "title":"my title","vote":"0"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote

get votings:

    curl -d '[{"username":"user", "title":"my title","id":1},{"username":"user", "title":"my title2","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes

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
