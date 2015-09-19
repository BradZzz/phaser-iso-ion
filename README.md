# myTV Stream

### myTV Stream - Webapp for simulated television streaming

This project is a website allowing users to view their favorite shows organized into channels and streamed like a real television network


### Structure

The backend is a nodejs express webserver, serving index.html, static assets, and a RESTful API for organizing channels, media, and users. The assets are backed by a MongoDB database hosted by MongoHQ (mongolab). The frontend is an angularjs single page app and the app itself is hosted on Heroku for ease of deployment and scaling.


### Building

Install node and npm if not already installed. Install [bower](http://bower.io/) (web package manager) and [gulp](http://gulpjs.com/) (build system).

```
npm install -g bower gulp
```

Install local dependencies

```
npm install
bower install
```

Compile the local development server

```
gulp
```

You can now run `node app.js` to run the localhost server. This is mainly used for debugging during development.

### Todo

### Environment Variables

The following environment variables are expected to be available:

`MONGODB`
`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`

### Inspiration



### License

MIT. Copyright (c) 2015 [Sesh](http://seshapp.com).
