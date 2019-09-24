# instagram-analytics [![Build Status](https://travis-ci.org/kevva/instagram-analytics.svg?branch=master)](https://travis-ci.org/kevva/instagram-analytics)

> Get user stats from Instagram


## Install

```
$ npm install instagram-analytics
```


## Usage

```js
const instagramAnalytics = require('instagram-analytics');

(async () => {
	console.log(await instagramAnalytics('foobar'));
	/*
	{
		comments: 351,
		description: 'A wonderful description',
		email: 'foobar@gmail.com',
		engagement: 0.02,
		followers: 821,
		…
	}
	*/
})();
```


## API

### instagramAnalytics(user, options?)

Returns a `Promise<Object>` for user stats with the following:

* `comments`: Total number of comments
* `description`: User description
* `email`: User email
* `engagement`: Average user engagement (`((comments + likes) / posts) / followers`)
* `followers`: Total number of followers
* `following`: Total number of following
* `frequency`: Returns a [`ms-to`](https://github.com/kevva/ms-to#usage) object with a post frequency between the first and last one
* `fullName`: User full name
* `id`: User id
* `likes`: Total number of likes
* `posts`: Total number of posts
* `url`: User Instagram url
* `username`: Same username as supplied
* `website`: User website

#### user

Type: `string`

Username to fetch stats from.

#### options

Type: `Object`

##### count

Type: `number`<br>
Default: `20`

Number of posts to fetch.
