/* eslint-disable func-names, prefer-arrow-callback */

const expect = require('expect');
const { slugify, reduceToObj, capitalizeFirstChar } = require('../../../server/utils/helpers');
const { entries } = require('../../__mocks__');

describe('helpers', function () {
  describe('slugify', function () {
    it('should convert a string to kebab-case', function () {
      expect(slugify('This is a test!')).toBe('this-is-a-test');
    });
  });

  describe('reduceToObj', () => {
    it('should create and an object of the keys in an array of objects', function () {
      expect(reduceToObj(entries, '_id', 'title')).toEqual({
        '58be1b901810931d043d9fc2': 'Test Entry',
        '58be1b901810931d043d9fc6': 'Test Entry Two',
      });
    });
  });

  describe('capitalizeFirstChar', function () {
    it('should capitalize the first character in a string', function () {
      const str = 'this is a string';
      expect(capitalizeFirstChar(str)).toBe('This is a string');
    });
    it('should return the same string if already capitalized', function () {
      const str = 'This is a string';
      expect(capitalizeFirstChar(str)).toBe('This is a string');
    });
  });
});

// describe('loggedIn', function () {
//   const next = f => f;
//   const res = { json: f => f };

//   it('should check if the request has a user object', async function () {
//     await loggedIn({ user: 'not undefined!' }, res, next);
//     expect(next).toBeCalled();
//   });

//   it('should fail on null user', async () => {
//     await loggedIn({ user: undefined }, res, next);
//     expect(next).not.toBeCalled();
//   });
// });
