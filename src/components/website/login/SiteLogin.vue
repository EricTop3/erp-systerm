<template>
  <div class="login_container">
    <div class="container">
      <h1 style=" color: #fff; margin-bottom: 50px;">HEY  CAKE门店管理系统</h1>
      <form class="form-inline">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="用户名" v-model="username">
        </div>
        <div class="form-group ml10">
          <input type="text" class="form-control" placeholder="密码" v-model="password">
        </div>
        <!--<div class="form-group ml10">-->
          <!--<input type="text" class="form-control" placeholder="验证码" style="width: 100px;;">-->
        <!--</div>-->
        <span type="submit" class="btn btn-info ml10" @click="uploadLogin">登录</span>
      </form>
    </div>
  </div>
</template>
<script>
  import {requestUrl,postDataToApi,siteLogin} from '../../../publicFunction/index'
  export default {
    ready: function () {
    },
    methods:  {
      uploadLogin: function () {
        var loginUrl =  requestUrl + '/front-system/auth/login'
        var data = {
          account: this.username,
          password: this.password
        }
        siteLogin(loginUrl,data)
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login_container{
    width:100%;
    height: 100%;
    display: table;
    background: url('/static/assets/images/login_bg.jpg') top center no-repeat;
  }
  .container{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
</style>

