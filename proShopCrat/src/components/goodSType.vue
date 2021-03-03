<template>
  <div>
    <van-button v-if="isLogin" type="info" @click="entryGoodsToDb"
      >添加商品</van-button
    >
    <!-- 横向栏目 -->
    <div class="wrapDiv cle">
      <van-tabs @click="headCoulumnFn" v-model="tabActive" animated>
        <van-tab
          v-for="(item, inx) in goodsCategoryData"
          :key="inx"
          :title="item.n"
        >
          <h1>{{ item.d }}</h1>
          <img class="imgSize" :src="item.i" />
        </van-tab>
        <!-- <van-tab title="房门"> 内容 </van-tab>
        <van-tab title="家具"> 内容 </van-tab>
        <van-tab title="电线"> 内容 </van-tab> -->
      </van-tabs>
    </div>

    <!-- 商品录入框 -->
    <div v-if="isEntryGoods" class="goodsEntry cle">
      <div v-for="item in emptyGoodsDomArr">
        <entryGoods
          @pushGoodsInfo="pushGoodsInfoFn"
          @isVoldFalse="isVoldFalseFn"
        />
      </div>

      <van-button type="danger" @click="addGoodsInputBtn">增加商品</van-button>
      <van-button type="danger" @click="submitBtn">提交</van-button>
      <van-button type="danger" @click="cancelBtn">取消</van-button>
    </div>
    <div class="entryGoodsDivBgi" v-if="isEntryGoodsDivBg"></div>
    <!-- 侧边分类栏 -->
    <div class="sideBarFn">
      <van-sidebar v-model="activeKey" @change="onChange">
        <van-sidebar-item
          v-for="(item, inx) in goodsCategoryData"
          :key="inx"
          :title="item.n"
        />
      </van-sidebar>
    </div>
    <!-- 竖向栏目的数据 -->
    <div class="columnData">
      <ul v-for="item in goodsListData" @click="gotoGoodsProduct(item)">
        <li><img :src="item.img" alt="" /></li>
        <li class="dd">{{ item.name }}</li>
        <li>${{ item.price }}</li>
        <li>{{ item.describe }}</li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pageChange">
      <van-pagination
        v-model="currentPage"
        :total-items="totalItems"
        :items-per-page="2"
        mode="simple"
        @change="pageChangeFn"
      />
    </div>

    <footerBar></footerBar>
  </div>
</template>
<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import entryGoods from "./entryGoods";
import footerBar from "./footerBar";
import { Notify } from "vant";
import { Sidebar, SidebarItem } from "vant";
export default {
  name: "goodsType",
  data() {
    return {
      msg: "商品分类页",
      tabActive: 0,
      isLogin: false,
      activeKey: 0,
      // 分页 currentPage当前第几页
      currentPage: 1,
      totalItems: 0,
      isEntryGoods: false,

      //四框填完了没
      isGoodsInfoWrite: false,
      isNameRepeat: true,

      //空白的录入框
      emptyGoodsDomArr: [{}],
      isEntryGoodsDivBg: false,
      //接收录入商品的总的大对象
      entryGoodsObj: [],

      //获得商品大类
      goodsCategoryData: "",

      //竖向栏目
      goodsListData: [],
    };
  },
  components: { entryGoods, footerBar },
  created() {
    //获得商品大类
    this.getGoodsCategoryFn();
    // 查询栏目所属的商品列表
    this.getCategoryGoodsListFn("goodsList_a");
    // 如果没有数据，那么下面的都不执行
    if (!localStorage.userName) {
      return;
    }
    if (localStorage.userName) {
      this.$notify(
        JSON.parse(localStorage.userName).username + "你已经登录,欢迎回来"
      );
      this.msg = "商品分类页" + localStorage.userName;
    }
    // console.log(JSON.parse(localStorage.userName)._id);
    let _n = JSON.parse(localStorage.userName)._id;
    if (localStorage.userName && _n === "6034cdde46328038f4810203")
      this.isLogin = true;

    // 分页
    this.pageChangeFn();
  },
  watch: {
    activeKey(_inx) {
      let _c = this.goodsCategoryData[_inx].d;
      this.getCategoryGoodsListFn(_c);
      this.currentPage = 1;
      this.pageChangeFn();
    },
  },
  methods: {
    // 跳转到产品详情页
    gotoGoodsProduct(_item) {
      this.$router.push({
        name: "goodsProduct",
        query: {
          _goodsObjId: _item._id,
          _collectionName: _item.category,
        },
      });
    },
    // 分页时触发
    pageChangeFn() {
      console.log(this.currentPage);
      /*
         点击下一页时,你要跳过的文档是，(currentPage-1)*每一页显示2个
        例如,你点击下一页时,第三页
        (3-1),已经翻过2页
        2*2,你一共需要跳过4个文档
        即,第3页要显示的第一个文档,其实是总文档数的第5个。

        所以在翻页的接口,你要传入二个值,
          -要跳过的文档数，
          -你要查询的集合,
      */
      //  获得集合的名,它里面的索引,跟分页没关系
      console.log(this.goodsCategoryData);
      let _c = "";
      if (!this.goodsCategoryData) {
        _c = "goodsList_a";
      } else {
        _c = this.goodsCategoryData[this.activeKey].d;
      }

      axios
        .get(API_LIST.getPageChange, {
          params: {
            startNum: (this.currentPage - 1) * 2,
            c: _c,
          },
        })
        .then((_d) => {
          console.log(_d.data);
          this.goodsListData = _d.data;
        });
    },
    // 横向分类
    headCoulumnFn(_inx) {
      // console.log(_inx);
      // tabActive:横向索引
      this.activeKey = _inx;
    },
    //侧边分类栏
    onChange(index) {
      this.activeKey = index;
      // console.log(this.goodsCategoryData[index].d);
      let _c = this.goodsCategoryData[index].d;
      this.getCategoryGoodsListFn(_c);
      // activeKey侧边索引
      this.tabActive = index;
    },
    // 查询栏目所属的商品列表
    getCategoryGoodsListFn(_c) {
      axios
        .get(API_LIST.getCategoryGoodsList, {
          params: { categoryId: _c },
        })
        .then((_d) => {
          // console.log(_d.data);
          //分类下的所有商品的总数，用在分页上
          this.totalItems = _d.data.length;
          // this.goodsListData = _d.data;
        });
    },
    //添加商品信息到，总的商品信息的数组的对象
    pushGoodsInfoFn(_goodsInfoObj) {
      // 判断商品名称是否重名
      let _is = true;

      for (let i = 0; i < this.entryGoodsObj.length; i++) {
        if (this.entryGoodsObj[i].n === _goodsInfoObj.n) {
          _is = false;
          break;
        }
      }
      if (_is) {
        this.entryGoodsObj.push(_goodsInfoObj);
        this.isNameRepeat = true;
      } else {
        this.isNameRepeat = false;
        this.$dialog.alert({
          message: "商品重名了",
        });
      }

      //四个框全写完了
      this.isGoodsInfoWrite = true;
    },
    // 四个对象没有写完时触发
    isVoldFalseFn() {
      this.isGoodsInfoWrite = false;
    },
    //四个框全填完。才能增加新的空白框,并且不重名
    addGoodsInputBtn() {
      let _is = "";
      if (this.isGoodsInfoWrite) {
        this.emptyGoodsDomArr.push({});
      } else {
        // 这里的逻辑不搞这么复杂
        this.$dialog.alert({
          message: "有框还没有写完,或者.重名",
        });
      }
    },
    // 录入商品
    entryGoodsToDb() {
      this.isEntryGoods = true;
      this.isEntryGoodsDivBg = true;
    },
    // 提交新增商品
    submitBtn() {
      console.log(this.entryGoodsObj);
      axios.post(API_LIST.insertGoods, this.entryGoodsObj).then((_d) => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: _d.data.regInfo,
          })
          .then(() => {
            //商品录入窗口关闭;
            this.isEntryGoods = false;
            this.isEntryGoodsDivBg = false;
            //空白输入框的数量重置
            this.emptyGoodsDomArr = [{}];

            //获得商品列表-大类，更新页面
            this.getGoodsCategoryFn();
          });
      });
    },
    // 取消提交商品
    cancelBtn() {
      this.isEntryGoods = false;
      this.isEntryGoodsDivBg = false;
    },
    // 获得商品列表-大类
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        // console.log(_d.data);
        this.goodsCategoryData = _d.data;
      });
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
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.wrapDiv p.tip {
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.goodsCategory {
  clear: both;
  margin: 10px 0;
  height: 50px;
}
.goodsCategory:hover {
  background: #ddd;
}
.goodsCategory li {
  float: left;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}
.goodsEntry {
  width: 80%;
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -42%;
  z-index: 112;
  padding: 10px;
  background: #ddd;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.entryGoodsDivBg {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 111;
  position: absolute;
  top: 0;
  left: 0;
}
.imgSize {
  width: 100%;
  height: 100%;
}
.sideBarFn {
  width: 80px;
  position: absolute;
  top: 330px;
  left: 0;
  z-index: 10;
}
.columnData {
  clear: both;
  width: 70%;
  height: 200px;
  background: #eee;
  border: 1px solid #666;
  margin: 0 0 0 90px;
}
.columnData ul {
  display: block;
  /* clear: both; */
  overflow: hidden;
  margin: 10px 0;
  background: #ddd;
}
.columnData ul li {
  float: left;
}
/* .columnData ul li.tip {
  background: #eee;
  padding: 2px;
} */
.columnData ul li img {
  width: 50px;
  height: 50px;
}
.pageChange {
  width: 85%;
  float: right;
  clear: both;
}
</style>