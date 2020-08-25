import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    goodslistdata: []
  },
  mutations: {
    //初始化数据
    innitgoodslist(state, data) {
      state.goodslistdata = data
    },
    //加减商品数量
    changegoodslist(state, params) {
      for (let obj of state.goodslistdata) {
        for (let child of obj.foods) {
          if (child.id == params.id) {
            child.num += params.num
            return
          }
        }
      }
    }
  },
  getters: {
    suregoodslist(state) {
      let arr = [];
      for (let obj of state.goodslistdata) {
        for (let child of obj.foods) {
          if (child.num > 0) {
            arr.push(child)
          }
        }
      }
      return arr;
    }
  },
})