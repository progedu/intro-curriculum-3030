'use strict';
const pug = require('pug');
const assert = require('assert');

// pug のテンプレートにおける XSS 脆弱性のテスト
const html = pug.renderFile('./views/posts.pug', {
  posts: [{
    id: 1,
    content: '<script>alert(\'test\');</script>',
    postedBy: 'guest1',
    trackingCookie: '7429259352464549_cdf6816244dfdcccf979e23710ba553b3ddbdb5c',
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  user: 'guest1'
});

// スクリプトタグがエスケープされて含まれていることをチェック
assert(html.includes('&lt;script&gt;alert(\'test\');&lt;/script&gt;'));
// trackingCookieの左側の整数がoriginalTrackingIdとして表示されてるか？
// 右側の16進数化されたハッシュ値は非表示になってるか？
assert(html.includes('7429259352464549'));
assert(!html.includes('cdf6816244dfdcccf979e23710ba553b3ddbdb5c'));
console.log('テストが正常に完了しました');

