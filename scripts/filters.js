/* global hexo */
'use strict';

hexo.extend.filter.register('before_post_render', function (post) {
  return post;
});
