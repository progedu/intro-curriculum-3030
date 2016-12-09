'use strict';
const jade = require('jade');
const assert = require('assert');

// jade のテンプレートにおける XSS 脆弱性のテスト
const html = jade.renderFile('./views/posts.jade', {
  posts: [{
    id: 1,
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '2639292283224063_ddcc625203464a9e10af58fc3eb92eed7df4b9b5',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.indexOf('&lt;script&gt;alert(\'test\');&lt;/script&gt;') !== -1);
//Hashが含まれていないことをチェック
assert(html.indexOf('2639292283224063_ddcc625203464a9e10af58fc3eb92eed7df4b9b5') === -1);
//IDが含まれている事をチェック
assert(html.indexOf('2639292283224063') !== -1);
console.log('テストが正常に完了しました');

