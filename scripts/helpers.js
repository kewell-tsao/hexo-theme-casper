/* global hexo */
'use strict';

const { join, relative } = require('path');
const { existsSync } = require('fs');
const { stripHTML, url_for } = Object.entries(require('hexo-util'))
  .filter(([, func]) => typeof func === 'function')
  .reduce((util, [name, func]) => {
    util[name] = func.bind(hexo);
    return util;
  }, {});

hexo.extend.helper.register('reading_time', function (html) {
  return Math.round(stripHTML(html).length / 500);
});

hexo.extend.helper.register('post_card_cover', function (post) {
  return post_cover(post);
});

hexo.extend.helper.register('post_head_cover', function (post) {
  return post_cover(post);
});

const coverExtensions = ['.jpg', '.png'];

function coverExists(prefix, { slug }) {
  const fileBase = join(hexo.source_dir, 'images', prefix, slug);
  for (let ext of coverExtensions) {
    const filePath = fileBase + ext;
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

function coverUrl(filePath) {
  let path = relative(hexo.source_dir, filePath).replaceAll(/\\/g, '/');
  if (path && path.length && path[0] !== '/') path = '/' + path;
  const url = url_for(path);
  return url;
}

function post_cover(post) {
  const { cover_img, tags, categories } = post;
  if (cover_img && cover_img.length) {
    if (/^https?:\/\//.test(cover_img)) {
      return cover_img;
    }
    return url_for(cover_img);
  }
  let url = null;
  if (tags && tags.forEach) {
    tags.forEach((tag) => {
      if (url) return;
      let filePath = coverExists('tags', tag);
      if (filePath) {
        url = coverUrl(filePath);
      }
    });
  }
  if (url) return url;
  if (categories && categories.forEach) {
    categories.forEach((category) => {
      if (url) return;
      let filePath = coverExists('categories', category);
      if (filePath) {
        url = coverUrl(filePath);
      }
    });
  }
  return url;
}
