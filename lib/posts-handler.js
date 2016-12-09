'use strict';
const crypto = require('crypto');
const jade = require('jade');
const Cookies = require('cookies');
const moment = require('moment-timezone');
const util = require('./handler-util');
const Post = require('./post');

const trackingIdKey = 'tracking_id';

function handle(req, res) {
  const cookies = new Cookies(req, res);
  const trackingId = addTrackingCookie(cookies, req.user);
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'charset': 'utf-8'
      });
      Post.findAll({ order: 'id DESC' }).then((posts) => {
        posts.forEach((post) => {
          post.content = post.content.replace(/\+/g, ' ');
          post.formattedCreatedAt = moment(post.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
        });
        res.end(jade.renderFile('./views/posts.jade', {
          posts: posts,
          user: req.user
        }));
        console.info(
          `閲覧されました: user: ${req.user}, ` +
          `trackinId: ${trackingId},` +
          `remoteAddress: ${req.connection.remoteAddress}, ` +
          `userAgent: ${req.headers['user-agent']} `
          );
      });
      break;
    case 'POST':
      req.on('data', (data) => {
        const decoded = decodeURIComponent(data);
        const content = decoded.split('content=')[1];
        console.info('投稿されました: ' + content);
        Post.create({
          content: content,
          trackingCookie: trackingId,
          postedBy: req.user
        }).then(() => {
          handleRedirectPosts(req, res);
        });
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

function handleDelete(req, res) {
  switch (req.method) {
    case 'POST':
      req.on('data', (data) => {
        const decoded = decodeURIComponent(data);
        const id = decoded.split('id=')[1];
        Post.findById(id).then((post) => {
          if (req.user === post.postedBy || req.user === 'admin') {
            post.destroy();
            console.info(
              `削除されました: user: ${req.user}, ` +
              `remoteAddress: ${req.connection.remoteAddress}, ` +
              `userAgent: ${req.headers['user-agent']} `
              );
          }
          handleRedirectPosts(req, res);
        });
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

/**
 * Cookieに含まれているトラッキングIDに異常がなければその値を返し、
 * 存在しない場合や異常なものである場合には、再度作成しCookieに付与してその値を返す
 * @param {Cookeies} cookies
 * @param {String} userName
 * @return {String} トラッキングID
 */
function addTrackingCookie(cookies, userName) {
  const requestedTrackingId = cookies.get(trackingIdKey);
  if (isValidTrackingId(requestedTrackingId, userName)) {
    return requestedTrackingId;
  } else {
    const originalId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const tomorrow = new Date(new Date().getTime() + (1000 * 60 * 60 * 24));
    const trackingId = originalId + '_' + createValidHash(originalId, userName);
    cookies.set(trackingIdKey, trackingId, { expires: tomorrow });
    return trackingId;
  }
}

function isValidTrackingId(trackingId, userName) {
  if (!trackingId) {
    return false;
  }
  const splited = trackingId.split('_');
  const originalId = splited[0];
  const requestedHash = splited[1];
  return createValidHash(originalId, userName) === requestedHash;
}

function createValidHash(originalId, userName) {
  const sha1sum = crypto.createHash('sha1');
  sha1sum.update(originalId + userName);
  return sha1sum.digest('hex');
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle: handle,
  handleDelete: handleDelete
};
