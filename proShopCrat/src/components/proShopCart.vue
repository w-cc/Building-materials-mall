<template>
  <div>
    <van-search
      v-model="searchValue"
      show-action
      placeholder="可以查询 啊"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-swipe :autoplay="3000" class="lunshow">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <!-- <div style="display: block">
      <div class="wrapDiv">
        <input
          type="text"
          class="leftDiv"
          ref="inputRef"
          placeholder="请输入"
        />
        <div class="rightDiv">{{ txt_data }}</div>
      </div>
      <van-button type="info" @click="sendBtn">发送</van-button>
      <van-button type="info" @click="getBtn">获取</van-button>
    </div> -->
    <!-- <div style="height: 1200px; overflow-y: scroll">
      <div v-for="itemObj in goodsObj" class="wrapDiv cle goodsList">
        <h1 class="goodsTitle">{{ itemObj.n }}</h1>
        <li
          v-for="goods in itemObj.goodsList_aa"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_bb"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_cc"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_dd"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>
      </div>
    </div> -->
    <van-tabs
      sticky
      v-for="(itemObj, inx) in goodsObj"
      :key="inx"
      class="wrapDiv cle goodsList"
    >
      <van-tab :title="itemObj.n">
        <li
          v-for="goods in itemObj.goodsList_aa"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_bb"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_cc"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>

        <li
          v-for="goods in itemObj.goodsList_dd"
          @click="goodsProductFn(goods)"
        >
          <label><img :src="goods.img" /></label>
          <div class="Size">{{ goods.name }}/￥{{ goods.price }}</div>
        </li>
      </van-tab>
    </van-tabs>
    <footerBar />
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIList.config";

import footerBar from "./footerBar";

export default {
  name: "proShopCart",
  data() {
    return {
      msg: "首页",
      isLogin: true,

      //所有商品总的数据，包括，栏目，
      goodsObj: "",
      // search
      searchValue: "",
      images: [
        "https://wangchencan.top/public/img/9.jpg",
        "https://wangchencan.top/public/img/5.jpg",
        "https://wangchencan.top/public/img/13.jpg",
        "https://wangchencan.top/public/img/18.jpg",
      ],
    };
  },
  components: { footerBar },
  created() {
    if (localStorage.userName) {
      let _str = JSON.parse(localStorage.userName);
      this.$notify(_str.username + "你已经登录,欢迎回来");
      this.isLogin = false;
      // 转为json来读取

      // console.log(JSON.parse(localStorage.userName));

      this.msg = "首页：" + _str.username;
    }
    // 查询所有栏目及栏目所属的商品
    this.getGoodsCategoryFn();
  },
  methods: {
    //商品详情页
    goodsProductFn(_self) {
      // console.log(_self);
      this.$router.push({
        name: "goodsProduct",
        query: {
          _goodsObjId: _self._id,
          _collectionName: _self.category,
        },
      });
    },
    // 查询所有栏目及栏目所属的商品
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        // console.table(_d.data);
        this.goodsObj = _d.data;
      });
    },
    // 退出登录
    logOutBtn() {
      localStorage.userName = "";
      this.isLogin = true;
      this.$notify(localStorage.userName + "你已经退出登录");
    },
    // 登录
    loginBtn() {
      this.$router.push({ path: "/userlogin" });
    },
    // 注册
    registerBtn() {
      this.$router.push({ path: "/register" });
    },
    onSearch() {
      console.log(this.searchValue);
      let _v = this.searchValue;
      if (_v === "" || _v === undefined) {
        this.$notify("查询条件不能为空");
      } else {
        axios
          .get(API_LIST.node_a, {
            params: { v_data: _v },
          })
          .then(() => {
            this.getBtn();
          });
      }
    },

    getBtn() {
      axios.get(API_LIST.node_b).then((_d) => {
        console.log(_d.data);
        this.$notify(_d.data[0].name);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
.lunshow {
  height: 30%;
  width: 80%;
  margin: 0 auto;
}
.lunshow img {
  height: 200px;
  width: 100%;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cle:after {
  content: "";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}

.wrapDiv {
  width: 80%;
  height: 300px;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.leftDiv {
  float: left;
  width: 40%;
  margin: 10px;
  border-radius: 10px;
  height: 30px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.rightDiv {
  float: right;
  width: 40%;
  margin: 10px;
  border-radius: 10px;
  height: 30px;
  border: 1px solid #999;
  padding: 10px;
  background: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.sliderDiv {
  width: 80%;
  margin: 10px auto;
}
.sliderDiv img {
  width: 100%;
  height: 188px;
}

.goodsEntry {
  width: 80%;
  margin: 10px auto;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.goodsCategory {
  clear: both;
  margin: 10px 0;
}
.goodsCategory li {
  float: left;

  height: 20px;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}
.goodsList {
  position: relative;
}
.goodsList li {
  float: left;
  width: 130px;
  height: 125px;
  overflow: hidden;
  position: relative;
}
.Size {
  position: absolute;
  top: 105px;
}
.goodslist li label {
  width: 100px;
  height: 115px;
  display: block;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  position: relative;
  border: 1px solid #666;
}
.goodsList li img {
  height: 100px;
  width: 100px;
  position: absolute;
  float: left;
  clear: both;
  display: block;
  margin: 5px auto;
  padding: 0;
}
.goodsList h1.goodsTitle {
  clear: both;
  margin: 5px auto;
  font-size: 22px;
  border-radius: 5px;
  background: #5d5d5d;
  width: 50%;
  color: #fff;
  padding: 3px 0;
}
</style>
