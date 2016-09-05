import test from 'ava';
import m from './';

test('users', async t => {
	const [cats, unicorns] = await m.users(['cats_of_instagram', 'unicornchronicles']);

	t.is(cats.username, 'cats_of_instagram');
	t.is(unicorns.username, 'unicornchronicles');
});

test('post', async t => {
	const users = await m.post('BIspYlBjhEk', {count: 1});
	t.truthy(users.length);
});
