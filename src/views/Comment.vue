<template>
  <div class="box">
    <div>
      <!-- 评分 -->
      <van-row class="rank">
        <!-- 左 -->
        <van-col span="8" class="left">
          <span>4.5</span>
          <h3>综合评分</h3>
          <p>高于周边商家96%</p>
        </van-col>
        <!-- 右 -->
        <van-col span="16" class="right">
          <p>
            <span class="staring">服务态度</span>
            <van-rate
              v-model="value"
              void-icon="star"
              color="#FFC300"
              size="15px"
              readonly
              allow-half
            />
            <span class="ranking">4.5</span>
          </p>
          <p>
            <span class="staring">送菜质量</span>
            <van-rate
              v-model="value"
              void-icon="star"
              color="#FFC300"
              size="15px"
              readonly
              allow-half
            />
            <span class="ranking">4.5</span>
          </p>
          <p>
            送达时间
            <span class="time">20分钟</span>
          </p>
        </van-col>
      </van-row>
      <!-- 评价 -->
      <van-row class="nav">
        <!-- 导航 -->
        <van-col span="8" class="subnav active">
          全部
          <span>{{msg.length}}</span>
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
      <div class="person">
        <div class="comment" v-for="(items,index) in msg" :key="index">
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
              <span>{{items.deliveryTime}}分钟送达</span>
            </p>
            <p class="text">{{items.text}}</p>
            <div class="hand">
              <van-icon name="good-job" color="#FEC200" />
              <div class="icons">
                <span v-for="(item,index) in items.recommend" :key="index">{{item}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shopratings } from "../api/apis";
import { gettime } from "../utils/utils";
import BSscroll from "better-scroll";

export default {
  data() {
    return {
      value: 4.5,
      activeName: "a",
      msg: [],
    };
  },
  created() {
    shopratings().then((res) => {
      for (let msg of res.data.data) {
        msg.rateTime = gettime(msg.rateTime);
      }
      this.msg = res.data.data;
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
  background-color: #f4f5f7;
  overflow: scroll;
  .rank {
    padding: 20px 5px;
    background-color: #fff;
    .left {
      text-align: center;
      border-right: 3px solid #f6f6f6;
      span {
        display: inline-block;
        color: #ffc300;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      h3 {
        font-weight: bold;
        margin-bottom: 5px;
      }
      p {
        font-size: 10px;
        color: #afafaf;
      }
    }
    .right {
      padding: 0px 20px;
      p {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .staring {
          display: inline-block;
          margin-right: 10px;
        }
        .ranking {
          font-size: 12px;
          color: #ffc300;
          margin-left: 10px;
        }
        .time {
          font-size: 12px;
          margin-left: 10px;
          color: #afafaf;
        }
      }
    }
  }
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
        border-top-left-radius: 5%;
        border-bottom-left-radius: 5%;
      }
      &:nth-child(2) {
        border-left: 0;
        border-right: 0;
      }
      &:nth-child(3) {
        border-top-right-radius: 5%;
        border-bottom-right-radius: 5%;
      }
    }
    .active {
      color: #000;
      background-color: #ffc300;
    }
  }
  .person {
    padding: 10px;
    background-color: #fff;
    .comment {
      display: flex;
      border-bottom: 1px solid #f6f6f6;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 60px;
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
        .hand {
          display: flex;
          padding-bottom: 20px;
          .icons {
            display: flex;
            flex-wrap: wrap;
            margin-left: 5px;
          }
          span {
            color: #afafaf;
            margin: 2px;
            padding: 3px;
            font-size: 12px;
            border: 1px solid #afafaf;
          }
        }
      }
    }
  }
}
</style>