import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import SignInForm from '../components/user/SignInForm.vue';
import SignUpForm from '../components/user/SignUpForm.vue';
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
        component: SignInForm
      },
      {
        path: 'signup',
        name: 'Sign up',
        component: SignUpForm
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'YouTube Favourite Lists',
    component: Dashboard
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
