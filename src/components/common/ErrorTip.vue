<template>
  <!--错误信息弹出-->
  <modal :show.sync='errModal' :modal-size="messageTipModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal'  aria-label='Close'><span
        aria-hidden='true' @click="errModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body">{{errInfo}}</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='close'>关闭</button>
    </div>
  </modal>
</template>
<script>
   import Modal from '../common/Modal'
   export default {
     name: 'error-tip',
     components: {
       Modal: Modal
     },
     props: {
       errInfo: 'high,这是错误提示哟',
       errModal: false
     },
     methods:{
       close: function () {
         this.errModal = false
       }
     },
     data: function () {
       return {
         messageTipModalSize: 'modal-sm'
       }
     }
   }
</script>
<style scoped>
  .modal-body{
    text-align: center;
  }
</style>
