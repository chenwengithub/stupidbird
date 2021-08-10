// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              name: 'login',
              component: './User/login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/weigh',
            },
            {
              path: '/weigh',
              name: 'weigh',
              component: './weigh',
            },
            {
              path: '/instore',
              name: 'instore',
              component: './instore',
            },
            {
              path: '/outstore',
              name: 'outstore',
              component: './outstore',
            },
            {
              path: '/financial_affairs',
              name: 'financial_affairs',
              component: './financial_affairs',
            },
            {
              path: '/report',
              name: 'report',
              component: './report',
            },
            {
              path: '/manage',
              name: 'manage',
              // authority: ['admin'],
              routes: [
                {
                  path: '/manage/steelplant',
                  name: 'steelplant',
                  component: './manage/steelplant',
                  hideInBreadcrumb: true,
                },
                {
                  path: '/manage/truck',
                  name: 'truck',
                  component: './manage/truck',
                  hideInBreadcrumb: true,
                },
                {
                  path: '/manage/intermediary',
                  name: 'intermediary',
                  component: './manage/intermediary',
                  hideInBreadcrumb: true,
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy['pre'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
