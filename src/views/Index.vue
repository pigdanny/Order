<template>
  <div class="shoplist">
    <van-sidebar v-model="activeKey" class="left">
      <div>
        <van-sidebar-item
          :title="listname.name"
          v-for="(listname,index) in getgoodslist_x"
          :key="index"
          class="leftlist"
          @click="clicktab(index)"
        />
        <div class="nullbox"></div>
      </div>
    </van-sidebar>
    <div class="right">
      <div>
        <div class="shop" v-for="(items,index) in getgoodslist_x" :key="index" :id="index">
          <span class="title">{{items.name}}</span>
          <div class="list" v-for="(subitem,index) in items.foods" :key="index">
            <!-- 图片 -->
            <van-image
              width="6em"
              height="6em"
              fit="cover"
              radius="5px"
              :src="subitem.imgUrl"
              @click="showPopup(subitem)"
            />
            <!-- 商品详情弹出层 -->
            <van-popup
              v-model="show"
              get-container=".shoplist"
              closeable
              close-icon="close"
              class="wrap"
              duration="0"
            >
              <!-- 图片 -->
              <van-image width="100%" height="30%" fit="cover" :src="obj.imgUrl" />
              <!-- 价格 -->
              <div class="wrapbox">
                <h3>
                  <b>{{obj.name}}</b>
                </h3>
                <p class="sell">
                  <span>月售{{obj.sellCount}}份</span>
                  <span>好评度{{obj.rating}}%</span>
                </p>
                <div class="num">
                  <div class="numleft">
                    <span>￥</span>
                    <span>{{obj.price}}</span>
                    <span>￥99.22</span>
                  </div>
                  <div class="numright" @click="clicknum(1,obj.id)">
                    <button>
                      <van-icon name="shopping-cart" size="15px" color="#000" />加入购物车
                    </button>
                  </div>
                </div>
              </div>
              <!-- 商品介绍 -->
              <div class="wraptext">
                <h3>商品介绍</h3>
                <p>{{obj.goodsDesc}}</p>
              </div>
              <!-- 用户评论 -->
              <div class="wrapmsg">
                <!-- 导航 -->
                <van-row class="nav">
                  <van-col span="8" class="subnav active">
                    全部
                    <span>{{arr.length}}</span>
                  </van-col>
                  <van-col span="8" class="subnav">
                    满意
                    <span>18</span>
                  </van-col>
                  <van-col span="8" class="subnav">
                    不满意
                    <span>6</span>
                  </van-col>
                </van-row>
                <!-- 用户评论 -->
                <div class="wrapperson">
                  <div class="comment" v-for="(items,index) in obj.ratings" :key="index">
                    <van-image round width="40" height="40" fit="cover" :src="items.avatar" />
                    <div class="msg">
                      <p class="name">
                        <span class="left">{{items.username}}</span>
                        <span class="right">{{items.rateTime}}</span>
                      </p>
                      <p class="ranks">
                        <van-rate
                          v-model="items.score"
                          void-icon="star"
                          color="#FFC300"
                          size="15px"
                          readonly
                          allow-half
                        />
                      </p>
                      <p class="text">{{items.text}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </van-popup>
            <!-- 详情 -->
            <div class="text">
              <h3>
                <b>{{subitem.name}}</b>
              </h3>
              <van-tag color="#EEEEEE" text-color="#000" size>
                <b>特惠</b>
              </van-tag>
              <p class="sell">
                <span>月售{{subitem.sellCount}}份</span>
                <span>好评度{{subitem.rating}}%</span>
              </p>
              <div class="num">
                <div class="numleft">
                  <span>￥{{subitem.price.toFixed(2)}}</span>
                  <span>￥99.22</span>
                </div>
                <div class="numright">
                  <button @click="clicknum(-1,subitem.id)" v-show="subitem.num">-</button>
                  <span v-show="subitem.num">{{subitem.num}}</span>
                  <button @click="clicknum(1,subitem.id)">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goodslist } from "../api/apis";
import { gettime } from "../utils/utils";
import BSscroll from "better-scroll";

export default {
  data() {
    return {
      show: false,
      activeKey: 0,
      data: [],
      obj: {},
      arr: [],
    };
  },
  created() {
    goodslist().then((res) => {
      /* 加入购物数量 */
      for (let obj of res.data.goodsList) {
        for (let child of obj.foods) {
          child.num = 0;
        }
      }
      this.$store.commit("innitgoodslist", res.data.goodsList);
    });
  },
  mounted() {
    new BSscroll(".left", {
      click: true,
    });
    this.BSright = new BSscroll(".right", {
      click: true,
      probeType: 3,
    });
    this.BSright.on("scroll", (obj2) => {
      let _y = Math.abs(obj2.y);
      for (let obj2 of this.getarr) {
        if (_y >= obj2.startY && _y < obj2.endY) {
          this.activeKey = obj2.index;
          break;
        }
      }
    });
  },
  methods: {
    clicktab(index) {
      /* this.activeKey=index */
      this.BSright.scrollToElement(document.getElementById(index));
    },
    showPopup(subobj) {
      this.show = true;
      this.arr = subobj.ratings;
      for (let obj of subobj.ratings) {
        obj.rateTime = gettime(obj.rateTime);
      }
      this.obj = subobj;
    },
    /* 购物车 */
    clicknum(num, id) {
      this.$store.commit("changegoodslist", {
        num,
        id,
      });
    },
  },
  computed: {
    getarr() {
      let arr = [];
      let total = 0;
      for (let i = 0; i < this.data.length; i++) {
        let divheight = document.getElementById(i).offsetHeight;
        arr.push({ startY: total, endY: total + divheight, index: i });
        total += divheight;
      }
      return arr;
    },
    getgoodslist_x() {
      return this.$store.state.goodslistdata;
    },
  },
};
</script>

<style lang="less" scoped>
.shoplist {
  display: flex;
  flex: 1;
  overflow: hidden;
  > .left {
    width: 80px;
    overflow: scroll;
    background-color: #f7f8fa;
    .nullbox {
      height: 60px;
    }
  }
  > .right {
    overflow: scroll;
    flex: 1;
    .shop {
      &:last-of-type {
        padding-bottom: 60px;
      }
      > .title {
        display: inline-block;
        width: 100%;
        line-height: 30px;
        text-indent: 5px;
        border-left: 3px solid #dfdfdf;
        background: #f4f4f4;
      }
      > .list {
        display: flex;
        padding: 15px 10px;
        > .text {
          flex: 1;
          margin-left: 10px;
          h3 {
            margin-bottom: 10px;
          }
          .sell {
            line-height: 30px;
            font-size: 10px;
            color: #b1b1b1;
            span {
              margin-right: 10px;
            }
          }
          .num {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .numleft {
              span {
                margin-right: 2px;
                &:nth-child(1) {
                  color: #f33d0f;
                  font-weight: bold;
                  font-size: 16px;
                }
                &:nth-child(2) {
                  color: #b1b1b1;
                  font-size: 12px;
                  text-decoration: line-through;
                }
              }
            }
            .numright {
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
                margin: 0 5px;
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
  .wrap {
    width: 100%;
    height: 100%;
    background-color: #f4f5f7;
    .wrapbox {
      padding: 10px;
      margin-bottom: 20px;
      background-color: #fff;
      h3 {
        margin-bottom: 10px;
      }
      .sell {
        font-size: 10px;
        color: #b1b1b1;
        span {
          margin-right: 10px;
        }
      }
      .num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        .numleft {
          span {
            margin-right: 2px;
            &:nth-child(1) {
              color: #f33d0f;
              font-weight: bold;
              font-size: 14px;
            }
            &:nth-child(2) {
              color: #f33d0f;
              font-weight: bold;
              font-size: 22px;
            }
            &:nth-child(3) {
              color: #b1b1b1;
              font-size: 10px;
              text-decoration: line-through;
              margin-left: 5px;
            }
          }
        }
        .numright {
          button {
            width: 100px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: bold;
            border-radius: 35px;
            outline: none;
            border: none;
            background-color: #ffc300;
          }
        }
      }
    }
    .wraptext {
      background-color: #fff;
      padding: 10px;
      h3 {
        font-size: 16px;
        padding: 15px 0;
      }
    }
    .wrapmsg {
      display: flex;
      flex-direction: column;
      .nav {
        margin-top: 20px;
        padding: 15px 10px;
        background-color: #fff;
        .subnav {
          border: 1px solid #ffc300;
          text-align: center;
          line-height: 30px;
          font-weight: bold;
          font-size: 12px;
          color: #ffc300;
          &:nth-child(1) {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:nth-child(2) {
            border-left: 0;
            border-right: 0;
          }
          &:nth-child(3) {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
        .active {
          color: #000;
          background-color: #ffc300;
        }
      }
      .wrapperson {
        padding: 10px;
        background-color: #fff;
        flex: 1;
        .comment {
          display: flex;
          border-bottom: 1px solid #f6f6f6;
          margin-bottom: 10px;
          &:last-of-type {
            padding-bottom: 40px;
          }
          p {
            margin-bottom: 10px;
          }
          .msg {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 0 2px;
            .name {
              display: flex;
              justify-content: space-between;
              .left {
                font-weight: bold;
              }
              .right {
                font-size: 12px;
                color: #afafaf;
              }
            }
            .ranks {
              display: flex;
              align-items: center;
              span {
                color: #afafaf;
                margin-left: 10px;
                font-size: 12px;
              }
            }
            .text {
              font-weight: bold;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.van-sidebar-item--select::before {
  background-color: #ffc300;
}
</style>