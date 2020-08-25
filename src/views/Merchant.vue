<template>
  <div class="box">
    <div>
      <div class="subbox">
        <!-- 头部 -->
        <van-row class="top">
          <van-col span="20" class="title">
            <h3>{{data.name}}</h3>
            <div class="star">
              <van-rate
                v-model="data.score"
                void-icon="star"
                color="#FFC300"
                size="15px"
                readonly
                allow-half
              />
              <span>(661)</span>
              <span>月销1000单</span>
            </div>
          </van-col>
          <van-col span="4" class="like">
            <van-rate v-model="value2" :count="1" icon="like" void-icon="like-o" />
            <p>已收藏</p>
          </van-col>
        </van-row>
        <!-- 主体 -->
        <van-row>
          <van-col span="8" class="price">
            <p>起送价</p>
            <p>
              <span>{{data.minPrice}}</span>
              <span>元</span>
            </p>
          </van-col>
          <van-col span="8" class="price">
            <p>商家配送</p>
            <p>
              <span>{{data.deliveryPrice}}</span>
              <span>元</span>
            </p>
          </van-col>
          <van-col span="8" class="price">
            <p>平均配送时间</p>
            <p>
              <span>{{data.deliveryTime}}</span>
              <span>分钟</span>
            </p>
          </van-col>
        </van-row>
      </div>
      <van-row>
        <van-col span="24" class="mid"></van-col>
      </van-row>
      <div class="bottom">
        <!-- 公告 -->
        <van-row>
          <van-col span="24" class="msg">
            <h3>活动与公告</h3>
            <p class="msgs">{{data.bulletin}}</p>
            <van-divider class="line"></van-divider>
            <p v-for="(items,index) in data.supports" :key="index" class="remove">
              <van-tag color="#008CC9" text-color="#fff" class="tag">减</van-tag>
              <span>{{items}}</span>
            </p>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { shopseller } from "../api/apis";
import BSscroll from "better-scroll";

export default {
  data() {
    return {
      value2: 1,
      data: {},
    };
  },
  created() {
    shopseller().then((res) => {
      this.data = res.data.data;
    });
  },
  mounted() {
    let BSbox = new BSscroll(".box", {
      click: true,
    });
    BSbox;
  },
};
</script>

<style lang="less" scoped>
.box {
  overflow: scroll;
  .subbox {
    padding: 20px;
    .top {
      padding-bottom: 30px;
      border-bottom: 1px solid #f6f6f6;
      background-color: #fff;
      .title {
        h3 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .star {
          display: flex;
          align-items: center;
          font-size: 12px;
          span {
            margin-left: 10px;
            color: #afafaf;
          }
        }
      }
      .like {
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
          margin-top: 5px;
          font-size: 12px;
          color: #afafaf;
        }
      }
    }
    .price {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 10px;
      background-color: #fff;
      p {
        color: #afafaf;
        font-size: 12px;
        &:last-child {
          margin-top: 5px;
          span {
            &:first-child {
              font-size: 18px;
              color: #000;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .mid {
    height: 25px;
    background-color: #f4f5f7;
  }
  .bottom {
    padding: 0px 20px;
    .msg {
      margin-top: 20px;
      background-color: #fff;
      h3 {
        font-weight: bold;
        margin-bottom: 15px;
      }
      .msgs {
        color: #f63605;
      }
      .remove {
        line-height: 25px;
        span {
          margin-right: 5px;
        }
        &:last-child {
          margin-bottom: 70px;
        }
      }
    }
  }
}
</style>