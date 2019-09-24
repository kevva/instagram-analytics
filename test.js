import test from 'ava';
import instagramAnalytics from '.';

test('fetch user stats', async t => {
	const cats = await instagramAnalytics('cats');
	const err = await t.throwsAsync(instagramAnalytics(123), TypeError);

	t.is(err.message, 'Expected `username` to be of type `string` but received type `number`');
	t.is(cats.username, 'cats');
	t.is(cats.url, 'https://instagram.com/cats');
});

test('count option', async t => {
	const cats = await instagramAnalytics('cats', {count: 40});
	t.is(cats.posts, 40);
});

test('show helpful error when user doesn\'t exist', async t => {
	await t.throwsAsync(instagramAnalytics('non_existing_user_foo_bar'), 'User doesn\'t exist');
});
