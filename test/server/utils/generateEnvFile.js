// /* eslint-disable func-names, prefer-arrow-callback */

// const rewire = require('rewire');
// const expect = require('chai').expect;

// const generateEnvFile = rewire('../../../server/utils/generateEnvFile.js');

// describe('generateEnvFile', function () {
//   describe('generateSecret', function () {
//     // eslint-disable-next-line no-underscore-dangle
//     const generateSecret = generateEnvFile.__get__('generateSecret');
//     it('should generate a secret', function () {
//       const secret = generateSecret();
//       expect(secretto.equal.a('string');
//     });
//     it('should generate three different secrets', function () {
//       const s1 = generateSecret();
//       const s2 = generateSecret();
//       const s3 = generateSecret();
//       expect(s1).toNotEqual(s2);
//       expect(s1).toNotEqual(s3);
//       expect(s2).toNotEqual(s3);
//     });
//   });

//   it('should not generate a new .env file without DB_HOST', async function () {
//     const gen = generateEnvFile.__get__('generateEnvFile');
//     const generatedFile = await gen();
//     expect(generatedFileto.equal(false);
//   });
//   it('should generate a new .env file', async function () {
//     const gen = generateEnvFile.__get__('generateEnvFile');
//     const generatedFile = await gen();
//     expect(generatedFileto.equal(false);
//   });
// });
