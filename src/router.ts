import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/views/Index.vue';
import Editor from '@/views/editor';
import Board from '@/views/board';
import Articles from '@/views/articles.vue';

console.log(Articles);
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/articles/:category',
      name: 'articles',
      component: Articles
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: Editor
    },
    {
      path: '/board/:id',
      name: 'board',
      component: Board
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
