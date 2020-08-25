<template>
  <div id="app">
    <van-row class="top" :style="img">
      <!-- 店铺 -->
      <van-col span="24" class="title">
        <van-image width="70" height="70" fit="cover" radius="10px" :src="data.avatar" />
        <!-- 标题 -->
        <div class="name">
          <h3 class="remove">
            <van-tag type="danger" class="tag">品牌</van-tag>
            {{data.name}}
          </h3>
          <p>{{data.description}}/{{data.deliveryTime}}分钟送达</p>
          <p class="remove">
            <van-tag color="#fff" text-color="#f2826a" class="tag">减</van-tag>
            <span class="text">{{str}}</span>
          </p>
        </div>
        <!-- 链接 -->
        <div class="link">
          <button class="btn" @click="showPopup">
            5个
            <van-icon name="arrow" />
          </button>
          <van-popup v-model="show" class="wrap" closeable close-icon="close">
            <h3>{{data.name}}</h3>
            <div class="star">
              <van-rate
                v-model="data.score"
                count="5"
                void-icon="star"
                color="#FF9A02"
                allow-half
                readonly
                gutter="15px"
              />
            </div>
            <van-divider class="line">优惠信息</van-divider>
            <p v-for="(items,index) in data.supports" :key="index" class="supports">
              <van-tag color="#fff" text-color="#f2826a" class="tag">减</van-tag>
              <span>{{items}}</span>
            </p>
            <van-divider class="line">商家公告</van-divider>
            <p>{{data.bulletin}}</p>
          </van-popup>
        </div>
      </van-col>
      <!-- 公告 -->
      <van-notice-bar
        color="#fff"
        background="rgba(0,0,0,.5)"
        left-icon="volume-o"
        :text="data.bulletin"
        mode="link"
        @click="showPopup"
      />
    </van-row>
    <!-- 导航栏 -->
    <van-tabs v-model="activeName" duration="0" title-active-color="#ffc300" color="#ffc300">
      <van-tab title="商品" name="a" to="/"></van-tab>
      <van-tab title="评价" name="b" to="Comment"></van-tab>
      <van-tab title="商家" name="c" to="Merchant"></van-tab>
    </van-tabs>
    <!-- 路由组件 -->
    <router-view />
    <!-- 购物车 -->
    <van-row class="shopcar">
      <van-col span="8" class="left">
        <van-icon name="smile-o" size="1.5em" />
        <p>联系商家</p>
      </van-col>
      <van-col span="8" class="mid" @click="shopcontent">
        <div class="black"></div>
        <div class="midprice">
          <p class="car">
            <van-icon name="shopping-cart" :badge="totalnum" size="26px" color="#000" />
          </p>
          <div class="price">
            <span class="money">￥</span>
            <span class="top">{{totalprice.toFixed(2)}}</span>
            <p>
              <span>另需配送费￥4 元</span>
              <span class="m">|</span>
              <span>支持自取</span>
            </p>
          </div>
        </div>
      </van-col>
      <van-col span="8" class="right">去结算</van-col>
    </van-row>
    <!-- 购物车弹出层 -->
    <van-action-sheet v-model="shopcarshow" title="新用户下单立减5元" class="shopcarcontent">
      <div class="content">
        <!-- 弹出层顶部 -->
        <div class="topcontent">
          <span>购物车</span>
          <span></span>
          <span @click="clearcar">
            <van-icon name="replay" size="12" style="margin-right:2px" />清空购物车
          </span>
        </div>
        <!-- 弹出层内容 -->
        <div class="contentlist" v-for="(items,index) in getgoodslist_x" :key="index">
          <div class="contentname">
            <span>{{items.name}}</span>
            <span>￥{{items.price.toFixed(2)}}</span>
          </div>
          <div class="contentbtn">
            <button @click="clicknum(-1,items.id)">-</button>
            <span>{{items.num}}</span>
            <button @click="clicknum(1,items.id)">+</button>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { shopseller } from "./api/apis";
import { goodslist } from "./api/apis";

export default {
  data() {
    return {
      show: false,
      shopcarshow: false,
      length: 1,
      activeName: "a",
      str: "",
      img: "",
      data: {},
    };
  },
  created() {
    shopseller().then((res) => {
      this.data = res.data.data;
      this.img = `background:url(${res.data.data.avatar}) no-repeat;background-size: 100% 200%`;
      this.str = res.data.data.supports[0] + res.data.data.supports[1];
    });
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    shopcontent() {
      if (this.getgoodslist_x.length) {
        this.shopcarshow = true;
      }
    },
    clicknum(num, id) {
      this.$store.commit("changegoodslist", {
        num,
        id,
      });
      this.getgoodslist_x;
      if (!this.getgoodslist_x.length) {
        this.shopcarshow = false;
      }
    },
    clearcar() {
      goodslist().then((res) => {
        /* 加入购物数量 */
        for (let obj of res.data.goodsList) {
          for (let child of obj.foods) {
            child.num = 0;
          }
        }
        this.$store.commit("innitgoodslist", res.data.goodsList);
      });
      this.shopcarshow = false;
    },
  },
  computed: {
    getgoodslist_x() {
      return this.$store.getters.suregoodslist;
    },
    totalnum() {
      let total = 0;
      for (let obj of this.getgoodslist_x) {
        total += obj.num;
      }
      return total;
    },
    totalprice() {
      let total = 0;
      for (let obj of this.getgoodslist_x) {
        total += obj.price * obj.num;
      }
      return total;
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 20px 15px;
      background-color: rgba(0, 0, 0, 0.3);
      .name {
        color: #fff;
        flex: 1;
        padding-left: 10px;
        h3 {
          font-weight: bold;
          margin-bottom: 5px;
          display: flex;
        }
        p {
          margin-bottom: 5px;
          font-size: 14px;
        }
        .remove {
          display: flex;
          align-items: center;
          .tag {
            margin-top: 2px;
            margin-right: 5px;
            height: 18px;
          }
          .text {
            display: inline-block;
            width: 180px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .link {
        display: flex;
        align-items: flex-end;
        width: 55px;
        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          width: 55px;
          height: 26px;
          border-radius: 26px;
          margin-bottom: 2px;
          border: none;
          background-color: rgba(0, 0, 0, 0.4);
        }
        .wrap {
          color: #fff;
          width: 100%;
          height: 100%;
          padding: 50px 30px;
          background-color: rgba(0, 0, 0, 0.4);
          h3 {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            width: 100%;
          }
          .star {
            display: flex;
            justify-content: center;
            padding: 20px 0px;
          }
          .line {
            color: #ffffff;
            font-size: 14px;
            font-weight: bold;
          }
          .supports {
            line-height: 30px;
          }
          .tag {
            margin-right: 5px;
          }
        }
      }
    }
  }
  .shopcar {
    width: 100%;
    position: fixed;
    bottom: 0px;
    padding: 0 10px 10px;
    /* background-color: rgba(255, 255, 255, 0.7); */
    z-index: 9999;
    .left {
      width: 20%;
      height: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
      padding: 7px 10px;
      color: #afafaf;
      background-color: #222222;
    }
    .mid {
      width: 60%;
      height: 50px;
      display: flex;
      color: #afafaf;
      .black {
        width: 4px;
        background-color: #fff;
      }
      .midprice {
        display: flex;
        flex: 1;
        align-items: center;
        background-color: #222222;
        .car {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 40px;
          margin-left: 10px;
          background-color: #ffc300;
          .van-info {
            border: none;
            min-width: 16px;
            padding: 0px;
          }
        }
        .price {
          flex: 1;
          align-self: center;
          padding: 5px;
          font-size: 10px;
          .money {
            color: #fff;
            font-size: 12px;
          }
          .top {
            font-size: 18px;
            color: #fff;
          }
          .m {
            margin: 0 4px;
          }
        }
      }
    }
    .right {
      width: 20%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      color: #000;
      font-weight: bold;
      background-color: #ffc300;
    }
  }
  .shopcarcontent {
    height: 60%;
    .van-action-sheet__header {
      line-height: 40px;
      font-size: 12px;
      color: #f54619;
      background-color: #fee7c8;
    }
    .content {
      padding: 15px 10px 80px;
      flex: 1;
      .topcontent {
        display: flex;
        justify-content: space-between;
        line-height: 14px;
        padding-bottom: 20px;
        span {
          &:last-of-type {
            display: flex;
            align-items: center;
            color: #afafaf;
          }
        }
      }
      .contentlist {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        .contentname {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 80%;
          padding-right: 10px;
          span {
            &:nth-child(1) {
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &:nth-child(2) {
              font-size: 16px;
              color: #f63605;
              font-weight: bold;
              margin-left: 20px;
            }
          }
        }
        .contentbtn {
          button {
            width: 22px;
            height: 22px;
            border-radius: 22px;
            font-size: 16px;
            outline: none;
            border: 1px solid #cccccc;
            &:first-of-type {
              color: #cccccc;
            }
            &:last-of-type {
              background-color: #ffc300;
            }
          }
          span {
            display: inline-block;
            text-align: center;
            width: 15px;
            margin: 0 2px;
          }
        }
      }
    }
  }
}
</style>
