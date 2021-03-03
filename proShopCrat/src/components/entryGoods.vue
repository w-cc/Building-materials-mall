<template>
  <div class="wrapDiv">
    <input
      type="text"
      v-model="name"
      class="goodsEntry"
      @blur="nameBlurFn"
      placeholder="输入名称"
    />
    <input
      type="text"
      v-model="price"
      class="goodsEntry"
      @blur="priceBlurFn"
      placeholder="输入价格"
    />
    <input
      type="text"
      v-model="describe"
      class="goodsEntry"
      @blur="describeBlurFn"
      placeholder="输入描述"
    />
    <input
      type="text"
      v-model="img"
      class="goodsEntry"
      @blur="imgBlurFn"
      placeholder="输入图片"
    />
  </div>
</template>
<script>
export default {
  name: "entryGoods",
  data() {
    return {
      name: "",
      price: "",
      describe: "",
      img: "",
      itemGoodsInfo: {
        n: "",
        p: "",
        d: "",
        i: "",
      },
    };
  },
  methods: {
    nameBlurFn() {
      this.itemGoodsInfo.n = this.name;
      this.isInputCheckFn();
    },
    priceBlurFn() {
      this.itemGoodsInfo.p = this.price;
      this.isInputCheckFn();
    },
    describeBlurFn() {
      this.itemGoodsInfo.d = this.describe;
      this.isInputCheckFn();
    },
    imgBlurFn() {
      this.itemGoodsInfo.i = this.img;
      this.isInputCheckFn();
    },
    // 检查四个框是否都填完了
    isInputCheckFn() {
      //   console.log(this.itemGoodsInfo);
      let _is = true;
      for (let i in this.itemGoodsInfo) {
        if (!this.itemGoodsInfo[i]) {
          _is = false;
          break;
        }
      }
      if (_is) {
        // console.log("全写完了");
        this.$emit("pushGoodsInfo", this.itemGoodsInfo);
      } else {
        // console.log("没写完");
        this.$emit("isVoldFalse");
      }
    },
  },
};
</script>
<style scoped>
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
.wrapDiv {
  width: 80%;
  height: 180px;
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
  margin: 5px auto;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
</style>
