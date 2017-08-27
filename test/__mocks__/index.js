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
    title: 'Test Section',
    template: 'index',
    fields: [
      '58a232588397e21c8c8c8828',
      '58a37f8feae5082628cd21e0',
    ],
    dateCreated: 1488422909432,
  },
];

exports.users = [
  {
    _id: '59383c903e13393788eb01b2',
    username: 'anothaone',
    dateCreated: 1486492341619,
    // password: 'password',
    password: '$2a$06$J.cW7gg/AuEl0W2qAF81hexOyPEmqorQVY1A7p8OQ8k8Fuqo2AysK',
    name: {
      first: 'Example',
      last: 'Userstein',
    },
    email: 'anothaone@anothaone.com',
    image: 'default_user.png',
    usergroup: '59357fdf76fb4f43905c8138',
  },
  {
    _id: '589a12b5a08e0c2f24ece4e8',
    username: 'userstein',
    dateCreated: 1486492341619,
    // password: 'password',
    password: '$2a$06$J.cW7gg/AuEl0W2qAF81hexOyPEmqorQVY1A7p8OQ8k8Fuqo2AysK',
    name: {
      first: 'Example',
      last: 'Userstein',
    },
    email: 'example@userstein.com',
    image: 'default_user.png',
    usergroup: '59357fdf76fb4f43905c8138',
  },
];

exports.usergroups = [{
  _id: '59357fdf76fb4f43905c8138',
  title: 'Admin',
  slug: 'admin',
  permissions: {
    pages: {
      canAddPages: true,
      canDeletePages: true,
      canEditPages: true,
    },
    site: {
      canManagePlugins: true,
      canCustomStyles: true,
      canManageSite: true,
    },
    assets: {
      canIndexAssets: true,
      canDeleteAssets: true,
      canEditAssets: true,
      canAddAssets: true,
    },
    usergroups: {
      canViewUserGroups: true,
      canDeleteUserGroups: true,
      canEditUserGroups: true,
      canAddUserGroups: true,
    },
    users: {
      canChangeUsersUsergroup: true,
      canResetUserPasswords: true,
      canDeleteUsers: true,
      canEditUsers: true,
      canAddUsers: true,
    },
    entries: {
      canChangeEntryStatus: true,
      canEditDrafts: true,
      canSeeDrafts: true,
      canEditLive: true,
      canEditOthersEntries: true,
      canDeleteEntries: true,
      canAddEntries: true,
    },
    fields: {
      canEditFields: true,
      canDeleteFields: true,
      canAddFields: true,
    },
    sections: {
      canEditSections: true,
      canDeleteSections: true,
      canAddSections: true,
    },
  },
  dateCreated: '2017-06-05T15:59:27.303Z',
}];

exports.user = {
  email: 'user@user.com',
  username: 'testeroni',
  name: {
    first: 'Tester',
    last: 'McGee',
  },
  password: 'pass11',
};

exports.fields = [
  {
    _id: '59376a4feef58d4a74e2fdcd',
    handle: 'simpleText',
    slug: 'simple-text',
    title: 'Simple Text',
    required: false,
    type: 'Text',
    options: {
      placeholder: 'Example!',
    },
    dateCreated: 1496803919903,
  },
];

exports.pages = [{
  _id: '5946e863bd887652381ecfe9',
  handle: 'homepage',
  slug: 'homepage',
  route: '/',
  title: 'Homepage',
  template: 'index',
  homepage: true,
  fields: [],
  fieldLayout: ['5946e850bd887652381ecfe8'],
  dateCreated: 1497819235747,
}];
