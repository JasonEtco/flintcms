exports.entries = [
  {
    _id: '591e63abe9e41f00113de131',
    slug: 'test-entry',
    title: 'Test Entry',
    section: '58b787fd28044618a8f7a737',
    author: '589a12b5a08e0c2f24ece4e8',
    dateCreated: 1488853901010,
    fields: [],
  },
  {
    _id: '57be1b901810931d043d9fc6',
    title: 'Test Entry Two',
    slug: 'test-entry-two',
    section: '58b787fd28044618a8f7a737',
    author: '589a12b5a08e0c2f24ece4e8',
    dateCreated: 1488853902010,
    status: 'live',
    fields: [],
  },
  {
    _id: '58be1b901810931d043d9fc1',
    title: 'I\'m a draft!',
    section: '58b787fd28044618a8f7a737',
    author: '589a12b5a08e0c2f24ece4e8',
    dateCreated: 1488853903010,
    status: 'draft',
    fields: [],
  },
  {
    _id: '59be1b901810931d043d9fc1',
    title: 'I am always live!',
    slug: 'i-am-always-live',
    section: '58b787fd28044618a8f7a737',
    author: '59383c903e13393788eb01b2',
    dateCreated: 1488853904010,
    status: 'live',
    fields: [],
  },
];

exports.sections = [
  {
    _id: '58b787fd28044618a8f7a737',
    title: 'Test Section',
    slug: 'test-section',
    handle: 'testSection',
    template: 'entry',
    fields: [
      '58a232588397e21c8c8c8828',
      '58a37f8feae5082628cd21e0',
    ],
    dateCreated: 1488422908432,
  },
  {
    _id: '58b787fd28044618a7f7a737',
    title: 'Fixed Section',
    slug: 'fixed-section',
    handle: 'fixedSection',
    template: 'entry',
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
    dateCreated: 1486492331619,
    // password: 'password',
    password: '$2a$06$J.cW7gg/AuEl0W2qAF81hexOyPEmqorQVY1A7p8OQ8k8Fuqo2AysK',
    name: {
      first: 'Example',
      last: 'Userstein',
    },
    email: 'anothaone@anothaone.com',
    image: 'default_user.png',
    usergroup: '592a74034a0a9b372c3bff9c',
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
    usergroup: '592a74034a0a9b372c3bff9c',
    token: 'TOKEN',
  },
];

exports.usergroups = [{
  _id: '592a74034a0a9b372c3bff9c',
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
    plugins: {
      canManagePlugins: true,
    },
    sections: {
      canEditSections: true,
      canDeleteSections: true,
      canAddSections: true,
    },
  },
  dateCreated: 1486492351619,
}, {
  _id: '597530faa5535235e9137f53',
  title: 'Placeholder',
  slug: 'placeholder',
  permissions: {
    pages: {
      canAddPages: false,
      canDeletePages: false,
      canEditPages: false,
    },
    plugins: {
      canManagePlugins: false,
    },
    site: {
      canManagePlugins: false,
      canCustomStyles: false,
      canManageSite: false,
    },
    assets: {
      canIndexAssets: false,
      canDeleteAssets: false,
      canEditAssets: false,
      canAddAssets: false,
    },
    usergroups: {
      canViewUserGroups: false,
      canDeleteUserGroups: false,
      canEditUserGroups: false,
      canAddUserGroups: false,
    },
    users: {
      canChangeUsersUsergroup: false,
      canResetUserPasswords: false,
      canDeleteUsers: false,
      canEditUsers: false,
      canAddUsers: false,
    },
    entries: {
      canChangeEntryStatus: false,
      canEditDrafts: false,
      canSeeDrafts: false,
      canEditLive: false,
      canEditOthersEntries: false,
      canDeleteEntries: false,
      canAddEntries: false,
    },
    fields: {
      canEditFields: false,
      canDeleteFields: false,
      canAddFields: false,
    },
    sections: {
      canEditSections: false,
      canDeleteSections: false,
      canAddSections: false,
    },
  },
  dateCreated: 1486492351719,
}, {
  _id: '59357fdf76fb4f43905c7149',
  title: 'Can do nothing',
  slug: 'can-do-nothing',
  permissions: {
    pages: {
      canAddPages: false,
      canDeletePages: false,
      canEditPages: false,
    },
    plugins: {
      canManagePlugins: false,
    },
    site: {
      canManagePlugins: false,
      canCustomStyles: false,
      canManageSite: false,
    },
    assets: {
      canIndexAssets: false,
      canDeleteAssets: false,
      canEditAssets: false,
      canAddAssets: false,
    },
    usergroups: {
      canViewUserGroups: false,
      canDeleteUserGroups: false,
      canEditUserGroups: false,
      canAddUserGroups: false,
    },
    users: {
      canChangeUsersUsergroup: false,
      canResetUserPasswords: false,
      canDeleteUsers: false,
      canEditUsers: false,
      canAddUsers: false,
    },
    entries: {
      canChangeEntryStatus: false,
      canEditDrafts: false,
      canSeeDrafts: false,
      canEditLive: false,
      canEditOthersEntries: false,
      canDeleteEntries: false,
      canAddEntries: false,
    },
    fields: {
      canEditFields: false,
      canDeleteFields: false,
      canAddFields: false,
    },
    sections: {
      canEditSections: false,
      canDeleteSections: false,
      canAddSections: false,
    },
  },
  dateCreated: 1486492351819,
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
  template: 'index.njk',
  homepage: true,
  fields: [],
  fieldLayout: ['5946e850bd887652381ecfe8'],
  dateCreated: 1497819235747,
}, {
  _id: '5946e863bd887652381edfe9',
  handle: 'noTemplate',
  slug: 'no-template',
  route: '/no-template',
  title: 'No Template',
  template: 'template-no-exist',
  homepage: false,
  fields: [],
  fieldLayout: ['5946e850bd887652381ecfe8'],
  dateCreated: 1497819235847,
}, {
  _id: '5946e863bd887652382edfe9',
  slug: 'page-with-vars',
  handle: 'pageWithVars',
  route: '/page-with-vars',
  title: 'Page with vars',
  template: 'page-with-vars',
  homepage: false,
  fields: [],
  fieldLayout: ['5946e850bd887652381ecfe8'],
  dateCreated: 1497819235947,
}];

exports.site = {
  logsPath: '/app/logs',
  templatePath: '/app/templates',
  scssPath: '/app/scss',
  publicPath: '/app/public',
  plugins: [],
  debugMode: true,
  appDir: '/app',
  scssEntryPoint: 'main.scss',
  allowPublicRegistration: false,
  siteUrl: 'https://example.com',
  siteName: 'Example site title',
  scssIncludePaths: [
    'node_modules',
  ],
  style: '',
  defaultUserGroup: '592a74034a0a9b372c3bff9c',
};

exports.assets = [{
  _id: '5926e863bd887652382edfe9',
  title: 'Image',
  extension: 'png',
  filename: 'image.png',
  dateCreated: 1497819215947,
  width: 100,
  height: 100,
  size: 200,
  mimetype: 'image/png',
}, {
  _id: '5946e833bd887652382edfe9',
  title: 'Image Two',
  extension: 'png',
  filename: 'image2.png',
  dateCreated: 1497819225947,
  width: 100,
  height: 100,
  size: 200,
  mimetype: 'image/png',
}];
