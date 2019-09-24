import test from 'ava';
import m from '.';

test('fetch user stats', async t => {
	const cats = await m('cats');
	const err = await t.throws(m(123), TypeError);

	t.is(err.message, 'Expected a string, got number');
	t.is(cats.username, 'cats');
	t.is(cats.url, 'https://instagram.com/cats');
});

test('count option', async t => {
	const cats = await m('cats', {count: 40});
	t.is(cats.posts, 40);
});

test('show helpful error when user doesn\'t exist', async t => {
	await t.throws(m('non_existing_user_foo_bar'), 'User doesn\'t exist');
});
