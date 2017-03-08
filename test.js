import test from 'ava';
import m from './';

test('fetch user stats', async t => {
	const cats = await m('cats_of_instagram');
	const err = await t.throws(m(123), TypeError);

	t.is(err.message, 'Expected a string, got number');
	t.is(cats.username, 'cats_of_instagram');
	t.is(cats.url, 'http://instagram.com/cats_of_instagram');
});

test('count option', async t => {
	const cats = await m('cats_of_instagram', {count: 40});
	t.is(cats.posts, 40);
});
