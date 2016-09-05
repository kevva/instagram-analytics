# instagram-analytics [![Build Status](https://travis-ci.org/kevva/instagram-analytics.svg?branch=master)](https://travis-ci.org/kevva/instagram-analytics)

> Get user stats from Instagram


## Install

```
$ npm install --save instagram-analytics
```


## Usage

```js
const instagramAnalytics = require('instagram-analytics');

instagramAnalytics.users(['foobar', 'unicorn']).then(stats => {
	console.log(stats);
	/*
	[{
		activity: 1.23,
		comments: 351,
		commentsPerPost: 8,
		description: 'A wonderful description',
		email: 'foobar@gmail.com',
		engagement: 0.02,
		followers: 821,
		following: 387,
		fullName: 'Foo Bar',
		id: '2343gf12',
		likes: 581,
		likesPerPost: 12,
		posts: 146,
		url: 'http://instagram.com/foobar',
		username: 'foobar',
		website: 'http://foobar.com'
	}, {
		...
	}]
	 */
});
```


## API

### instagramAnalytics.users(users, [options])

#### users

Type: `Array`

Returns a promise for an array of user stats objects with:

* `activity`: Average posts per day
* `comments`: Total number of comments
* `commentsPerPost`: Average number of comments per post
* `description`: User description
* `email`: User email
* `engagement`: Average user engagement (`((comments + likes) / posts) / followers`)
* `followers`: Total number of followers
* `following`: Total number of following
* `fullName`: User full name
* `id`: User id
* `likes`: Total number of likes
* `likesPerPost`: Average number of likes per post
* `posts`: Total number of posts
* `url`: User Instagram url
* `username`: Same username as supplied
* `website`: User website

#### options

##### count

Type: `number`<br>
Default: `20`

Number of posts to fetch.

##### minEngagement

Type: `number`<br>
Default: `0`

Minimum amount of engagement.

##### minFollowers

Type: `number`<br>
Default: `0`

Minimum amount of followers.


### instagramAnalytics.post(id, [options])

#### id

Type: `string`

Fetch stats for all users that has commented on a post. Returns a promise for an array of user stats objects.

#### options

Same as above.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
