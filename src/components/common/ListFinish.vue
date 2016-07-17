<template>
  <!--完成-->
  <span class="btn btn-success btn-sm" data-toggle="modal" data-target="#inventory-audit-templ" @click="finish($event)">完成</span>
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
        this.$dispatch("finish",currentId)
        $.each(this.list, function (index, val) {
          if (val.id === currentId &&(val.checked === '已审核')) {
            val.checked = '已完成'
            self.$remove()
          }
        })
      }
    }
  }
</script>
