<template>
  <!--删除按钮-->
  <span class="btn btn-primary btn-sm" @click="edit">编辑</span>
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
        $.each(goodList, function (index, val) {
          if (val.id === deleteId) {
            goodList.splice(index, 1)
          }
        })
      }
    },
    data: function () {
      return {
        deleteModalSize: 'modal-sm'
      }
    }
  }
</script>
