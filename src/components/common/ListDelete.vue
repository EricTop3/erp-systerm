<template>
  <!--删除按钮-->
  <span class="btn btn-primary btn-sm"  @click="isDelete($event)">删除</span>
  <!--模态框-删除-->
  <modal :show.sync="deleteModal" :modal-size="deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4>删除弹出框！</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmDelelte()">保存</button>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="deleteModal=false">关闭</button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  var deleteId = 0
  export default{
    name: 'list-delete',
    components: {
      Modal: Modal
    },
    props: {
      deleteData: [],
      flag: false,
      deleteModal: false
    },
    methods: {
//      删除弹出框
      isDelete: function (event) {
        var currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        deleteId = currentId
        this.deleteModal = true
      },
//      确认删除
      confirmDelelte: function () {
        var goodList = this.deleteData
        this.deleteModal = false
        this.$dispatch('delete',deleteId)
//        $.each(goodList, function (index, val) {
//          if (val.id === deleteId) {
//            goodList.splice(index, 1)
//          }
//        })
      }
    },
    data: function () {
      return {
        deleteModalSize: 'modal-sm'
      }
    }
  }
</script>
