'use strict';
const getStream = require('get-stream');
const Instagram = require('instagram-screen-scrape');
const instagramUser = require('instagram-user');
const limitSizeStream = require('limit-size-stream');
const msTo = require('ms-to');

const getPosts = (user, count) => getStream.array(limitSizeStream.obj(new Instagram.InstagramPosts({username: user}), count));

module.exports = (user, opts) => {
	opts = Object.assign({count: 20}, opts);

	if (typeof user !== 'string') {
		return Promise.reject(new TypeError(`Expected a string, got ${typeof user}`));
	}

	return instagramUser(user).then(res => getPosts(user, opts.count).then(posts => {
		if (posts.length === 0) {
			return Object.assign(res, {
				comments: 0,
				engagement: 0,
				frequency: 0,
				likes: 0,
				posts: posts.length
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

		return Object.assign(res, {
			comments,
			engagement: ((comments + likes) / posts.length) / res.followers,
			frequency: msTo(Math.floor((first.time * 1000) - (last.time * 1000)) / posts.length),
			likes,
			posts: posts.length
		});
	})).catch(err => {
		if (err.statusCode === 404) {
			err.message = 'User doesn\'t exist';
		}

		throw err;
	});
};
