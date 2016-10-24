<template>
  <!--错误信息弹出-->
  <div class="modal-mask" v-show="show" transition="modal" @click="show=false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          404错误提示
        </div>

        <div class="modal-body">
            您访问的页面不存在或已经删除
        </div>

        <div class="modal-footer">
            <span class="btn btn-primary"
                    @click="returnLast">
              返回上一步
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
        console.log('wangg')
        window.history.back()
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
