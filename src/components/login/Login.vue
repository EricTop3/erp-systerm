<template>
  <div class="login_container">
    <div class="container" style="margin-top: 300px; width: 800px;">
      <h1 style=" color: #fff; margin-bottom: 50px;">HEY  CAKE门店管理系统</h1>
      <form class="form-inline">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="用户名">
        </div>
        <div class="form-group ml10">
          <input type="text" class="form-control" placeholder="密码">
        </div>
        <div class="form-group ml10">
          <input type="text" class="form-control" placeholder="验证码" style="width: 100px;;">
        </div>
        <button type="submit" class="btn btn-info ml10">登录</button>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'this is login vue'
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login_container{
    background: url('/static/assets/images/login_bg.jpg') top center no-repeat #000
  }
</style>

