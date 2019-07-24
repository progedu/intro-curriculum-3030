'use strict';
const pug = require('pug');
const assert = require('assert');

// pug のテンプレートにおける XSS 脆弱性のテスト
const html = pug.renderFile('./views/posts.pug', {
  posts: [{
    id: '4391976947991005_0d6aeb0d6ad6bc82d29857339d6f304b3054dd5b',
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '2639292283224063_ddcc625203464a9e10af58fc3eb92eed7df4b9b5',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.includes('&lt;script&gt;alert(\'test\');&lt;/script&gt;'));
console.log('テストが正常に完了しました');

