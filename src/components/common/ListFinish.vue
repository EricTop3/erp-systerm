<template>
  <!--完成-->
  <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-audit-templ" @click="finish($event)">完成</span>
</template>
<script>
  import $ from 'jquery'
  var currentId = 0
  export default{
    name: 'list-finish',
    props: {
      list: [],
      flag: false
    },
    methods: {
//       完成
      finish: function (event) {
        var self=this
        currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        $.each(this.list, function (index, val) {
          if (val.id === currentId &&(val.check === '已审核' || val.check_status === '已审核' )) {
            val.check = '已完成'
            val.check_status = '已完成'
            self.$remove()
          }
        })
      }
    }
  }
</script>
