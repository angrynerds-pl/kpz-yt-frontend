import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import PlaylistCreate from '../views/Playlist/PlaylistCreate.vue';
import Playlist from '../views/Playlist/Playlist.vue';
import User from '../views/User.vue';
import App from '../views/App.vue';
import SignInForm from '../components/user/SignInForm.vue';
import SignUpForm from '../components/user/SignUpForm.vue';
import store from '@/store';
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'YouTube Favourite Lists', 
    component: Home,
    children: [
      {
        path: '',
        name: 'Sign in',
        component: SignInForm,
        meta: {
          guest: true
        }
      },
      {
        path: 'signup',
        name: 'Sign up',
        component: SignUpForm,
        meta: {
          guest: true
        }
      }
    ]
  },
  {
    path: '/app',
    name: 'YouTube Favourite Lists',
    component: App,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'user',
        name: 'User',
        component: User
      },
      {
        path: 'playlists',
        name: 'Create playlist',
        component: PlaylistCreate
      },
      {
        path: 'playlists/:id',
        name: 'Playlist view',
        component: Playlist
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to: Route, from: Route, next) => {
  if (to.meta.guest && !store.getters['user/isLoggedIn']) next();
  else {
    if (store.getters['user/isLoggedIn']) {
      if (to.name == 'Sign in') next({ path: '/app' });
      else next();
    } else {
      next({
        path: '/'
      });
    }
  }
});

export default router;
