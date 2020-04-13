'use strict';
const pug = require('pug');
const assert = require('assert');

// pug のテンプレートにおける XSS 脆弱性のテスト
const html = pug.renderFile('./views/posts.pug', {
  posts: [{
    id: 1,
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '2104493986441693_133d648e476e9ce3d7f7b812916ba1ddf76bfe7b',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.includes('&lt;script&gt;alert(\'test\');&lt;/script&gt;'));
assert(html.includes('2104493986441693'));
assert(!html.includes('133d648e476e9ce3d7f7b812916ba1ddf76bfe7b'));
console.log('テストが正常に完了しました');

