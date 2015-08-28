# Blast

### Blast - Webapp for MMS-blasting apps

This project is a website allowing users to blast their friends with purchasable packs of MMS messages.


### Structure

The backend is a nodejs express webserver, serving index.html, static assets, and a RESTful API for purchasing MMS orders. The orders are backed by a MongoDB database hosted by MongoHQ (compose.io). The frontend is an angularjs single page app and the app itself is hosted on Heroku for ease of deployment and scaling.


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

* randomization of sent messages and previews
* expose category cms on prod
* support multiple servers (message scheduling)

### Environment Variables

The following environment variables are expected to be available:

`MONGODB`
`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
`STRIPE_PUBLIC_KEY_LIVE`
`STRIPE_PUBLIC_KEY_TEST`
`STRIPE_SECRET_KEY_LIVE`
`STRIPE_SECRET_KEY_TEST`
`TWILIO_ACCOUNT_SID`
`TWILIO_AUTH_TOKEN`

### Inspiration

* Cats
  * http://www.catfacts.co
  * https://www.catattack.co
* Dogs
  * http://pugaday.co
  * https://corgisplash.com
* Goats
  * https://goatattack.com

### Ideas

* Ionic App using native in-app purchases
* Admin category page for editing a category's contents

Categories: (risk 1=low; 5=high; -1=not interested)
  * Inspirational quotes (1)
  * upload your own shit
  * Gross shit
    * lemon party
    * blue waffles
  * Religious (1)
  * Weed pics (1)
  * Dick pics (4)
  * Word a day - vocabulary (1)
  * Chinese proverbs (1)
  * Fortune cookies (1)
  * Top GIFs
    * GoT
    * Silicon Valley
    * Puppies
    * Kitties
    * Shark week
    * Weird Japanese Shit
    * Kanye
    * Beyonce
    * Rihanna

Functionality:
  * Friend proxy..
    * Sometimes it's your friend responding, sometimes it's an AI

https://instagram.com/unspirational
https://instagram.com/thegoodquote
http://giphy.com/gameofthrones
http://www.gifanator.com

### License

MIT. Copyright (c) 2015 [Sesh](http://seshapp.com).
