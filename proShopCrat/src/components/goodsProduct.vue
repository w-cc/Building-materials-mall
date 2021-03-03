<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="goodsImgwrap"><img :src="goodsImgUrl" /></div>
    <h1>{{ goodsTitle }},{{ describe }},￥{{ price }}</h1>
    <van-sku
      v-model="show"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :hide-stock="sku.hide_stock"
      :quota-used="0"
      :reset-stepper-on-hide="false"
      :reset-selected-sku-on-hide="false"
      :close-on-click-overlay="true"
      :message-config="{}"
      @buy-clicked="onAddCartClicked"
      @add-cart="onAddCartFn"
      @sku-selected="switchProductType"
    />
    <!--footer底栏  -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="onHelpBtn" />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        :badge="cartGoods_mini_num"
        @click="gotoCartBtn"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="onClickBigBtn"
      />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>
  </div>
</template>
<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import footerBar from "./footerBar";
export default {
  name: "goodsProduct",
  data() {
    return {
      msg: "产品详情页",
      goodsTitle: "",
      goodsImg: "",
      goodsImgUrl: "",
      describe: "",
      price: "",
      cartGoods_mini_num: 0,

      show: false,
      goods: {},
      goodsId: "",
      sku: {
        tree: [
          {
            k: "产品类型", // skuKeyName：规格类目名称
            k_s: "s1", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [
              {
                id: "1", // skuValueId：规格值 id
                name: "红色", // skuValueName：规格值名称
              },
              {
                id: "1",
                name: "蓝色",
              },
            ],
            // largeImageMode: true, //  是否展示大图模式
          },
        ],
        list: [
          {
            id: 2259, // skuId
            s1: "1", // 规格类目 k_s 为 s1 的对应规格值 id
            s2: "1", // 规格类目 k_s 为 s2 的对应规格值 id
            price: "", // 价格（单位分）
            stock_num: 110, // 当前 sku 组合对应的库存
          },
        ],
        price: "", // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        hide_stock: false, // 是否隐藏剩余库存
      },
    };
  },
  created() {
    // console.log(this.$route.query);
    let _goodsId = this.$route.query._goodsObjId;
    let _collectionName = this.$route.query._collectionName;
    // 不是很安全
    // this.goodsTitle = this.$route.query._goodsObj.name;
    // this.goodsImgUrl = this.$route.query._goodsObj.img;
    // this.describe = this.$route.query._goodsObj.describe;
    // this.price = this.$route.query._goodsObj.price;

    this.getGoodsInfoFn(_goodsId, _collectionName);

    // 这个给sku的
    this.goodsId = _goodsId;
    //页面刚打开时，要加载之前保存的产品数据
    //你保存的是字符,所以要SON.parse转为对象
    var xx = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    console.log(xx);
    // 删除本地存储
    // localStorage.removeItem("cartDataInfo");

    // 当前购物车中商品总数,footer小数字
    this.total_carGoodsNum();
  },
  methods: {
    //根据id，获得对应商品信息
    getGoodsInfoFn(_gId, _collectionName) {
      axios
        .get(API_LIST.getGoodsInfo, {
          params: {
            _id: _gId,
            _c: _collectionName,
          },
        })
        .then((_d) => {
          // console.log(_d.data);
          this.goodsTitle = _d.data.name;
          this.goodsImgUrl = _d.data.img;
          this.describe = _d.data.describe;
          this.price = _d.data.price;

          //给goods的
          this.goods.title = _d.data.name;
          this.goods.picture = _d.data.img;
          this.sku.price = _d.data.price;
        });
    },
    //切换产品的类型 触发的方法
    switchProductType() {
      this.sku.list[0].price = this.sku.price;
      this.sku.price = this.sku.price;
    },
    onAddCartFn(_d) {
      //在真正的生产环境中，这个_d 的数据是要发给后端接口的
      // console.log(_d);

      // cart数据中，是否有相同的产品
      let _isTrue = false;
      let _temObj = {
        _id: _d.goodsId,
        _price: this.price,
        _num: _d.selectedNum,
        _goodsName: this.goodsTitle,
        _img: this.goodsImgUrl,
      };
      // console.log(_temObj);
      //已经保存在本地存储的数据
      let _cartData = localStorage.cartDataInfo
        ? JSON.parse(localStorage.cartDataInfo)
        : [];

      // console.log(_temObj);
      for (let i = 0; i < _cartData.length; i++) {
        if (_cartData[i]._id === _temObj._id) {
          _cartData[i]._num += _temObj._num;
          _isTrue = true;
          break;
        }
      }
      // 没有相同的，才直接push
      if (!_isTrue) {
        _cartData.push(_temObj);
      }
      // _temObj是js的对象，要转为字符，才能存到本地存储里
      localStorage.cartDataInfo = JSON.stringify(_cartData);
      this.$dialog
        .alert({
          message: "加入购物车成功",
        })
        .then(() => {
          this.show = false;
          this.total_carGoodsNum();
        });
    },
    // 当前购物车中商品总数
    total_carGoodsNum() {
      let _temp = localStorage.cartDataInfo
        ? JSON.parse(localStorage.cartDataInfo)
        : [];
      let _n = 0;
      for (let i = 0; i < _temp.length; i++) {
        _n += _temp[i]._num;
      }
      this.cartGoods_mini_num = _n;
    },
    onAddCartClicked() {
      this.show = true;
    },
    //   加入购物车
    onClickBigBtn() {
      this.show = true;
    },
    // 购物车跳转到购物车页面
    gotoCartBtn() {
      this.$router.push({ path: "/cart" });
    },
    // 客服
    onHelpBtn() {
      this.$dialog.alert({
        message: "客服正在忙请稍后",
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
.goodsImgwrap {
  width: 100%;
  height: 350px;
  overflow: hidden;
  margin: 0 auto;
}
.goodsImgwrap img {
  width: 100%;
  height: 350px;
}
</style>