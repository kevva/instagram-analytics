'use strict';
const got = require('got');
const instagramPosts = require('instagram-posts');
const msTo = require('ms-to');

const transformUser = user => Object.assign(user, {
	description: user.biography,
	followers: user.edge_followed_by.count,
	following: user.edge_follow.count,
	fullName: user.full_name,
	posts: user.edge_owner_to_timeline_media.count,
	url: `https://instagram.com/${user.username}`,
	website: user.external_url
});

module.exports = (username, options) => {
	options = Object.assign({count: 20}, options);

	if (typeof username !== 'string') {
		return Promise.reject(new TypeError(`Expected \`username\` to be of type \`string\` but received type \`${typeof username}\``));
	}

	return got(`https://instagram.com/${username}`, {
		json: true,
		query: {__a: 1}
	})
		.then(response => instagramPosts(username, {count: options.count})
			.then(posts => {
				const user = transformUser(response.body.graphql.user);

				if (posts.length === 0) {
					return Object.assign(user, {
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

				return Object.assign(user, {
					comments,
					engagement: ((comments + likes) / posts.length) / user.followers,
					frequency: msTo(Math.floor((first.time * 1000) - (last.time * 1000)) / posts.length),
					likes,
					posts: posts.length
				});
			}))
		.catch(error => {
			if (error.statusCode === 404) {
				error.message = 'User doesn\'t exist';
			}

			throw error;
		});
};
