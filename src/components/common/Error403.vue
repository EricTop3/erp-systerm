<template>
  <!--错误信息弹出-->
  <div class="modal-mask" v-show="show" transition="modal" @click="returnLast">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          403错误提示
        </div>

        <div class="modal-body">
          很遗憾，您没有权限访问该系统
        </div>

        <div class="modal-footer">
            <span class="btn btn-primary"
                  @click="returnLast">
              重新登录
            </span>
        </div>
      </div>
    </div>
  </div>
  </body>
</template>
<script>
  export default {
    methods:{
      returnLast: function () {
        this.show = false
        window.location.href='#!/admin/login'
      }
    },
    data: function () {
      return {
        show: true
      }
    }
  }
</script>
<style scoped>
  .modal-header{
    text-align: center;
  }
  .modal-body{
    text-align: center;
    padding: 50px 0;
  }
  .form-horizontal{
    background: #fff;
    opacity: 0.8;
  }
</style>
