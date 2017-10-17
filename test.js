'use strict';
const jade = require('jade');
const assert = require('assert');

// jade のテンプレートにおける XSS 脆弱性のテスト
const html = jade.renderFile('./views/posts.jade', {
  posts: [{
    id: 1,
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '1333145127638121_048ab767587b1d3970232d480fd20a2fba8e8f0a',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.indexOf('&lt;script&gt;alert(\'test\');&lt;/script&gt;') > 0);
console.log('テストが正常に完了しました');
