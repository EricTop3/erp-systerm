<template>
  <div class="login_container">
    <div class="container">
      <h1 style=" color: #fff; margin-bottom: 50px;">HEY  CAKE门店管理系统</h1>
      <form class="form-inline">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="用户名" v-model="username">
        </div>
        <div class="form-group ml10">
          <input type="password" class="form-control" placeholder="密码" v-model="password">
        </div>
        <!--<div class="form-group ml10">-->
          <!--<input type="text" class="form-control" placeholder="验证码" style="width: 100px;;">-->
        <!--</div>-->
        <span type="submit" class="btn btn-info ml10" @click="uploadLogin">登录</span>
      </form>
    </div>
    <!--错误信息-->
    <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
  </div>
</template>
<script>
  import {requestUrl,postDataToApi,siteLogin} from '../../../publicFunction/index'
  import ErrorTip from '../../common/ErrorTip'
  export default {
    components:{
      ErrorTip: ErrorTip
    },
    methods:  {
      uploadLogin: function () {
        var self = this
        if(this.userName ===""){
          this.modal.errModal = true,
          this.modal.errInfo = '请输入您的登录名'
        } else if(this.password ==="") {
          this.modal.errModal = true,
            this.modal.errInfo = '请输入您的密码'
        }else{
          var loginUrl =  requestUrl + '/front-system/auth/login'
          var data = {
            account: this.username,
            password: this.password
          }
          siteLogin(loginUrl,data,function (err) {
            if(err.data.code ==='100000'){
              self.modal.errModal = true,
                self.modal.errInfo = '你的账号不存在'
            }
            if(err.data.code ==='110004'){
              self.modal.errModal = true,
                self.modal.errInfo = '你的密码错误'
            }
          })
        }

      }
    },
    data: function () {
      return {
        username: '',
        password: '',
        modal:{
          errModal: false,
          errInfo: ''
        }
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

