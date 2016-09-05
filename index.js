'use strict';
const arrayUniq = require('array-uniq');
const DateDiff = require('date-diff');
const getEmails = require('get-emails');
const getStream = require('get-stream');
const got = require('got');
const Instagram = require('instagram-screen-scrape');
const limitSizeStream = require('limit-size-stream');

const getComments = id => {
	const stream = new Instagram.InstagramComments({post: id});
	return getStream.array(stream).then(res => arrayUniq(res.map(x => x.username)));
};

const getPosts = (user, opts) => {
	const stream = new Instagram.InstagramPosts({username: user});
	return getStream.array(limitSizeStream.obj(stream, opts.count));
};

const getUser = user => {
	const url = `http://instagram.com/${user}/?__a=1`;

	return got(url, {json: true}).then(res => ({
		description: res.body.user.biography || '',
		email: getEmails(res.body.user.biography || '')[0] || '',
		followers: res.body.user.followed_by.count,
		following: res.body.user.follows.count,
		fullName: res.body.user.full_name,
		id: res.body.user.id,
		posts: res.body.user.media.count,
		url: `http://instagram.com/${user}`,
		username: res.body.user.username,
		website: res.body.user.external_url || ''
	}));
};

module.exports.users = (users, opts) => {
	opts = Object.assign({
		count: 20,
		minEngagement: 0,
		minFollowers: 0
	}, opts);

	if (!Array.isArray(users)) {
		return Promise.reject(new TypeError(`Expected an array, got ${typeof users}`));
	}

	return Promise.all(users.map(x => getUser(x).then(user => getPosts(x, opts).then(posts => {
		if (posts.length === 0) {
			return Object.assign(user, {
				comments: 0,
				commentsPerPost: 0,
				engagement: 0,
				likes: 0,
				likesPerPost: 0,
				postsPerDay: 0
			});
		}

		const first = posts[0];
		const last = posts[posts.length - 1];

		let comments = 0;
		let likes = 0;

		for (const x of posts) {
			comments += x.comments;
			likes += x.likes;
		}

		return Object.assign(user, {
			comments,
			commentsPerPost: comments / posts.length,
			engagement: ((comments + likes) / posts.length) / user.followers,
			likes,
			likesPerPost: likes / posts.length,
			postsPerDay: posts.length / new DateDiff(new Date(first.time * 1000), new Date(last.time * 1000)).days()
		});
	})))).then(users => users.filter(x => x.engagement >= opts.minEngagement && x.followers >= opts.minFollowers));
};

module.exports.post = (id, opts) => {
	opts = Object.assign({
		count: 20,
		minEngagement: 0,
		minFollowers: 0
	}, opts);

	if (typeof id !== 'string') {
		return Promise.reject(new TypeError(`Expected a string, got ${typeof id}`));
	}

	return getComments(id).then(users => module.exports.users(users, opts));
};
