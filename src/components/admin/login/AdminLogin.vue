<template>
  <div class="login">
    <div class="container-fluid line-top"></div>
    <div class="container-fluid content">
      <div style="width: 550px; margin: 0 auto;">
        <h1>HEY  CAKE门店管理系统</h1>
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-3 control-label">用户名</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" placeholder="用户名">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">密码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" placeholder="密码">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">验证码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control fl" placeholder="验证码" style="width: 120px;">
              <span class="spanblocks ml10 yzm">1258</span>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-3 col-sm-9">
              <button type="submit" class="btn btn-primary btn-lg" >登录</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="container-fluid line-bottom"></div>
  </div>
</template>
