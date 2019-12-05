'use strict';
const pug = require('pug');
const assert = require('assert');

// pug のテンプレートにおける XSS 脆弱性のテスト
const html = pug.renderFile('./views/posts.pug', {
  posts: [{
    id: 1,
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '4711788207269933_32b83d2ad4a72ea23dc656f0393b1798d0b76c85',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.includes('&lt;script&gt;alert(\'test\');&lt;/script&gt;'));
assert(html.includes('4711788207269933'));
assert(!html.includes('32b83d2ad4a72ea23dc656f0393b1798d0b76c85'));
console.log('テストが正常に完了しました');

