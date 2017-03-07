const { slugify, reduceToObj, loggedIn } = require('../server/utils/helpers');
const { entries } = require('../__mocks__/mockData');

describe('slugify', () => {
  it('should convert a string to kebab-case', () => {
    expect(slugify('This is a test!')).toBe('this-is-a-test');
  });
});

describe('reduceToObj', () => {
  it('should create and an object of the keys in an array of objects', () => {
    expect(reduceToObj(entries, '_id', 'title')).toEqual({
      '58be1b901810931d043d9fc2': 'Test Entry',
      '58be1b901810931d043d9fc6': 'Test Entry Two',
    });
  });
});

describe('loggedIn', () => {
  const next = jest.fn();
  const res = { json: jest.fn().mockReturnThis() };

  it('should check if the request has a user object', async () => {
    await loggedIn({ user: 'not undefined!' }, res, next);
    expect(next).toBeCalled();
  });

  it('should fail on null user', async () => {
    await loggedIn({ user: undefined }, res, next);
    expect(next).not.toBeCalled();
  });
});
