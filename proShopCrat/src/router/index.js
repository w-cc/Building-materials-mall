import Vue from 'vue'
import Router from 'vue-router'
import proShopCart from '@/components/proShopCart'
import register from '@/components/register'
import userlogin from '@/components/userlogin'
import goodsType from '@/components/goodsType'
import goodsProduct from '@/components/goodsProduct'
import cart from '@/components/cart'
import userAccout from '@/components/userAccout'

Vue.use(Router)

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'proShopCart',
      component: proShopCart
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/userlogin',
      name: 'userlogin',
      component: userlogin
    },
    {
      path: '/goodsType',
      name: 'goodsType',
      component: goodsType
    },
    {
      path: '/goodsProduct',
      name: 'goodsProduct',
      component: goodsProduct
    }, {
      path: '/cart',
      name: 'cart',
      component: cart
    }
    , {
      path: '/userAccout',
      name: 'userAccout',
      component: userAccout
    }

  ]
})


