/* global hexo */
'use strict';

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
