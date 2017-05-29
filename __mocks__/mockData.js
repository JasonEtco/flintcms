exports.entries = [
  {
    _id: '58be1b901810931d043d9fc2',
    slug: 'test-entry',
    title: 'Test Entry',
    section: '58b787fd28044618a8f7a737',
    author: '589a12b5a08e0c2f24ece4e8',
    dateCreated: '2017-03-07T02:31:44.010Z',
    fields: [],
  },
  {
    _id: '58be1b901810931d043d9fc6',
    slug: 'test-entry-two',
    title: 'Test Entry Two',
    section: '58b787fd28044618a8f7a737',
    author: '589a12b5a08e0c2f24ece4e8',
    dateCreated: '2017-04-07T02:31:44.010Z',
    fields: [],
  },
];

exports.sections = [
  {
    _id: '58b787fd28044618a8f7a737',
    slug: 'test-section',
    title: 'Test Section',
    template: 'index',
    fields: [
      '58a232588397e21c8c8c8828',
      '58a37f8feae5082628cd21e0',
    ],
    dateCreated: '2017-03-02T02:48:29.432Z',
  },
];

exports.users = [
  {
    _id: '589a12b5a08e0c2f24ece4e8',
    dateCreated: '2017-02-07T18:32:21.619Z',
    password: '$2a$10$ygS4nRWUtp9/VMb9GnC7POu5WVUZ7KqgZKylVUWa.rcfIUhRfyGw.',
    name: {
      first: 'Example',
      last: 'Userstein',
    },
    username: 'exampleusername',
    email: 'example@userstein.com',
    image: 'default_user.png',
    usergroup: '592a74034a0a9b372c3bff9c',
  },
];
