<template>
  <div class="login">
    <div class="container-fluid line-top"></div>
    <div class="container-fluid content">
      <div style="width: 550px; margin: 0 auto;">
        <h1>HEY  CAKE后台管理系统</h1>
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
                <input type="password" class="form-control" placeholder="密码" v-model="password">
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
    <!--错误信息-->
    <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
  </div>
</template>
<script>
  import {requestSystemUrl,postDataToApi,adminLogin} from '../../../publicFunction/index'
  import ErrorTip from '../../common/ErrorTip'
  export default{
    components:{
      ErrorTip: ErrorTip
    },
    ready: function(){
      var self = this
      document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0]
        if(e && e.keyCode === 13){
          self.loginUpload()
        }
      }
    },
    methods: {
      // 获取数据的方法
      loginUpload: function () {
        var self = this
        if(this.username === ""){
          this.modal.errModal = true,
          this.modal.errInfo = '请输入您的登录名'
        } else if (this.password === ""){
          this.modal.errModal = true,
          this.modal.errInfo = '请输入您的密码'
        }else{
          var loginUrl =  requestSystemUrl + '/backend-system/auth/login'
          var data = {
            account: this.username,
            password: this.password
          }
          adminLogin(loginUrl,data,function (err) {
            if (err.data.code === '100000') {
              self.modal.errModal = true
              self.modal.errInfo = '账户不存在'
            } else if (err.data.code === '110004') {
              self.modal.errModal = true
              self.modal.errInfo = '你的密码错误'
            } else if (err.data.code === '110007') {
              self.modal.errModal = true
              self.modal.errInfo = '账户不可用'
            }
          })
        }
      }
    },
    data: function () {
      return {
        modal: {
         errModal: false,
         errInfo: ''
        },
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
