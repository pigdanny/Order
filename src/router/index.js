import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/Comment',
    name: 'Comment',
    component: () => import('../views/Comment.vue')
  },
  {
    path: '/Merchant',
    name: 'Merchant',
    component: () => import('../views/Merchant.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router