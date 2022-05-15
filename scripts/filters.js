/* global hexo */
"use strict";

hexo.extend.filter.register("after_post_render", function (post) {
  if (post.path === "ops/106-deploy-img-masternode/") {
    hexo.log.info(post.title);
    debugger;
  }
  return post;
});
