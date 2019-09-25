'use strict';
const instagramPosts = require('instagram-posts');
const instagramUser = require('instagram-user');
const msTo = require('ms-to');

module.exports = async (username, options) => {
	options = {count: 20, ...options};

	if (typeof username !== 'string') {
		throw new TypeError(`Expected \`username\` to be of type \`string\` but received type \`${typeof username}\``);
	}

	try {
		const [user, posts] = await Promise.all([
			instagramUser(username),
			instagramPosts(username, {count: options.count})
		]);

		let comments = 0;
		let likes = 0;

		if (posts.length === 0) {
			return {
				...user,
				comments,
				engagement: 0,
				frequency: 0,
				likes,
				posts: posts.length
			};
		}

		const [firstPost, lastPost] = [posts[0], posts[posts.length - 1]];

		for (const post of posts) {
			comments += post.comments;
			likes += post.likes;
		}

		return {
			...user,
			comments,
			engagement: ((comments + likes) / posts.length) / user.followers,
			frequency: msTo(Math.floor((firstPost.time * 1000) - (lastPost.time * 1000)) / posts.length),
			likes,
			posts: posts.length
		};
	} catch (error) {
		if (error.response.statusCode === 404) {
			error.message = `User "${username}" not found`;
		}

		throw error;
	}
};
