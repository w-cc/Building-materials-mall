<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="goBackFn"
    />

    <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      :error-message="userErr"
    />
    <van-field
      v-model="password"
      type="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passErr"
    />

    <van-button type="info" @click="userloginFn">登录</van-button>
    <van-button type="info" @click="registerBtn">注册</van-button>
    <footerBar />
  </div>
</template>
<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import footerBar from "./footerBar";
export default {
  name: "userlogin",
  data() {
    return {
      msg: "登录页面",
      username: "",
      password: "",

      //   userErr: "用户名不能空",
      //   passErr: "密码不能为空",
      //   desErr: "个性签名可写可不写",
      userErr: "",
      passErr: "",
    };
  },
  components: { footerBar },
  methods: {
    //  回到上一步
    goBackFn() {
      this.$router.go(-1);
    },
    // 跳转到注册页
    registerBtn() {
      this.$router.push({ path: "/register" });
    },
    userloginFn() {
      let _loginObj = {
        U: this.username,
        P: this.password,
      };
      // console.log(_loginObj);
      axios.post(API_LIST.userLogin_post, _loginObj).then((_d) => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: "欢迎您" + _d.data.regInfo.username + "登录成功",
          })
          .then(() => {
            if (_d.data.reg_code === 3) {
              // 存的时候转成字符串存
              localStorage.userName = JSON.stringify(_d.data.regInfo);
            }
            // 登录成功，回到首页
            this.$router.push({ path: "/" }),
              () => {
                localStorage.setItem("inxState", 3);
              };
          });
      });
    },
  },
};
</script>
<style scoped>
.van-cell {
  width: 300px;
  margin: 0 auto;
}
</style>
