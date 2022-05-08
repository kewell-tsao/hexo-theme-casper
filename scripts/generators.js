/* global hexo */
'use strict';

// service worker
hexo.extend.generator.register('txt', () => {
  var r = hexo.config.root;
  var sw =
    'var CACHE_NAME="' +
    +new Date() +
    '",urlsToCache=["' +
    r +
    '"];self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(e){return e.addAll(urlsToCache)}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){if(e!==CACHE_NAME)return caches.delete(e)}))}))}),self.addEventListener("fetch",function(n){n.respondWith(caches.match(n.request).then(function(e){if(e)return e;var t=n.request.clone();return fetch(t).then(function(e){if(!e||200!==e.status||"basic"!==e.type)return e;var t=e.clone();return caches.open(CACHE_NAME).then(function(e){e.put(n.request,t)}),e})}))});';
  return {
    path: 'sw.js',
    data: sw,
  };
});

// hexo.log.warn()

// local search
hexo.extend.generator.register('json', (locals) => {
  if (!hexo.theme.config.local_search) return;

  ('use strict');
  var config = hexo.config;
  var posts = locals.posts.sort('-date');
  var res = [];
  var index = 0;

  if (posts) {
    posts.each((post) => {
      var tempPost = {};
      if (post.title) {
        tempPost.title = post.title;
      }
      if (post.path) {
        tempPost.url = config.root + post.path;
      }
      if (post._content) {
        tempPost.content = post._content;
      }
      if (post.tags && post.tags.length > 0) {
        var tags = [];
        post.tags.forEach((tag) => {
          tags.push(tag.name);
        });
        tempPost.tags = tags;
      }
      if (post.categories && post.categories.length > 0) {
        var categories = [];
        post.categories.forEach((cate) => {
          categories.push(cate.name);
        });
        tempPost.categories = categories;
      }
      res[index] = tempPost;
      index += 1;
    });
  }

  return [
    {
      path: 'searchData.json',
      data: JSON.stringify(res),
    },
    {
      path: 'searchVersion.txt',
      data: +new Date() + '',
    },
  ];
});
