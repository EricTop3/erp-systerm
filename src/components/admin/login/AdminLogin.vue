<template>
  <div class="login">
    <div class="container-fluid line-top"></div>
    <div class="container-fluid content">
      <div style="width: 550px; margin: 0 auto;">
        <h1>HEY  CAKE门店管理系统</h1>
        <validator name="validation1">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-3 control-label">用户名</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" placeholder="用户名" v-model="username">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">密码</label>
              <div class="col-sm-9">
                <input type="password" class="form-control" placeholder="密码" v-model="password"  v-validate:password="['password',required]">
              </div>
            </div>
            <!--<div class="form-group">-->
            <!--<label class="col-sm-3 control-label">验证码</label>-->
            <!--<div class="col-sm-9">-->
            <!--<input type="text" class="form-control fl" placeholder="验证码" style="width: 120px;">-->
            <!--<span class="spanblocks ml10 yzm">1258</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div class="validte_errors">
              <p v-if="$validation1.password.password">请输入6到18位包含数字和字母的密码</p>
            </div>-->
            <div class="form-group">
              <div class="col-sm-offset-3 col-sm-9">
                <span type="submit" class="btn btn-primary btn-lg" @click="loginUpload">登录</span>
              </div>
            </div>
          </form>
        </validator>
      </div>
    </div>
    <div class="container-fluid line-bottom"></div>
  </div>
</template>
<script>
  import {requestSystemUrl,postDataToApi,adminLogin} from '../../../publicFunction/index'
  export default{
    methods: {
      // 获取数据的方法
      loginUpload: function () {
        var loginUrl =  requestSystemUrl + '/backend-system/auth/login'
        var data = {
          account: this.username,
          password: this.password
        }
        adminLogin(loginUrl,data)
      }
    },
    data: function () {
      return {
        username: '',
        password: ''
      }
    }
  }
</script>
<style>
  .validte_errors{
    text-align: center;
    color: #d40b0b
  }
</style>
