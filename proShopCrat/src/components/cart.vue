<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      right-text="清空购物车"
      left-arrow
      @click-left="goBack"
      @click-right="cartEmptyFn"
    />
    <div class="goodsDiv" v-for="item in shopCartList">
      <label> <img :src="item._img" /> </label>
      <h2>{{ item._goodsName }} 数量{{ item._num }}单价{{ item._price }}</h2>
      <!-- async-change=true -->
      <van-stepper
        v-model="item['_num']"
        :async-change="true"
        @plus="addBtnFn"
        @minus="minusBtnFn"
      />
      <van-submit-bar
        :price="allGoodsMoney * 100"
        :button-text="submitTxt"
        @submit="onSubmit"
      />
    </div>
    <h1 v-if="isCartEmpty">当前购物车是空的，请去添加商品</h1>
  </div>
</template>
<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import { Toast } from "vant";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "cart",
  data() {
    return {
      msg: "购物车",
      carArr: "",
      allGoodsNum: 0,
      allGoodsMoney: 0,
      submitTxt: "",
      isCartEmpty: false,
    };
  },
  created() {
    // this.cartArr，在这一节里,就没有再使用,
    //但是，你也不要去删除它，
    //在这一切里,只是把vuex的流程，走一遍，
    //因为vant，它把一些东西封装的比较死，
    //所以vuex在这里就不再做更复杂的应用了。

    this.cartArr = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    if (this.cartArr.length === 0) {
      this.isCartEmpty = true;
    }
    console.log(this.cartArr);
    //计算所有商品的数量
    this.countAllGoodsNum();
    // 所有商品的总价
    this.countAllGoodsMoney();
    // vuex,  this.cartArr就是购物车中的商品
    this.addToVuex(this.cartArr);
  },
  computed: {
    // 映射 数据, 从Vuex的getter里
    ...mapGetters(["shopCartList"]),
  },
  methods: {
    //映射 事件
    ...mapActions(["addToVuex"]),

    // 去结账按钮
    onSubmit() {
      this.$dialog
        .alert({
          message:
            "共" +
            this.allGoodsNum +
            "个商品，总计" +
            this.allGoodsMoney +
            "元",
        })
        .then(() => {
          Toast.success("支付成功");
        });
    },
    // cartEmptyFn 清空购物车
    cartEmptyFn() {
      this.cartArr = localStorage.removeItem("cartDataInfo");
      this.submitTxt = "去结账(0)";
      this.allGoodsMoney = 0;
      this.isCartEmpty = true;
    },
    // 计算商品总数量
    countAllGoodsNum() {
      this.allGoodsNum = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsNum += this.cartArr[i]._num;
      }
      this.submitTxt = "去结账(" + this.allGoodsNum + ")";
    },
    // 计算商品的总价
    countAllGoodsMoney() {
      this.allGoodsMoney = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsMoney += this.cartArr[i]._num * this.cartArr[i]._price;
      }
    },
    goBack() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
    // 加减按钮
    addBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    minusBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
  },
};
</script>
<style scoped>
.pr {
  position: relative;
}
.pa {
  position: absolute;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
h2.title {
  font-size: 20px;
  text-align: center;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsDiv {
  width: 95%;
  margin: 5px auto;
  clear: both;
}
.goodsDiv label {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.goodsDiv label img {
  width: 100px;
  height: 100px;
}
.goodsDiv h2 {
  font-size: 22px;
}
</style>