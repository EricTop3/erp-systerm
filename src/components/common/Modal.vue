<template>
  <div class="modal-mask" v-show="show" transition="modal" @click="show=false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body" style="text-align: center">
            default body
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            default footer
            <button class="modal-default-button"
                    @click="show=false">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    name: 'modal',
    ready: function () {
      const modalContent = $(this.$el).find('.modal-content')
//      动态控制弹窗的大小
      modalContent.attr('class', 'modal-content').addClass(this.modalSize)
//      阻止事件冒泡
      modalContent.on('click', function (e) {
        e.stopPropagation()
      })
    },
    props: {
      show: {
        type: Boolean,
        required: true,
        toWay: true
      },
      modalSize: {defalut: 'modal-sm'}
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-mask {
    position: fixed;
    display: table;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }

  .modal-dialog {
    display: table-cell;
    vertical-align: middle;
  }
  .text-center{
    text-align: center;
  }
  .modal-content {
    margin: 0 auto;
    transition: transform .3s ease;
  }

  .modal-enter, .modal-leave {
    opacity: 0;
  }

  .modal-enter .modal-content,
  .modal-leave .modal-content {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>

