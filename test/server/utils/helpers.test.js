const { slugify, reduceToObj, capitalizeFirstChar } = require('../../../server/utils/helpers');

describe('helpers', () => {
  describe('slugify', () => {
    it('should convert a string to kebab-case', () => {
      expect(slugify('This is a test!')).toBe('this-is-a-test');
    });
  });

  describe('reduceToObj', () => {
    const obj = [
      { foo: 'one', bar: 'two' },
      { foo: 'three', bar: 'four' },
    ];
    it(
      'should create and an object of the keys in an array of objects',
      () => {
        expect(reduceToObj(obj, 'foo', 'bar')).toEqual({
          one: 'two',
          three: 'four',
        });
      },
    );
  });

  describe('capitalizeFirstChar', () => {
    it('should capitalize the first character in a string', () => {
      const str = 'this is a string';
      expect(capitalizeFirstChar(str)).toBe('This is a string');
    });
    it('should return the same string if already capitalized', () => {
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
//     expect(nextto.equalCalled();
//   });

//   it('should fail on null user', async () => {
//     await loggedIn({ user: undefined }, res, next);
//     expect(next).not.to.beCalled();
//   });
// });
