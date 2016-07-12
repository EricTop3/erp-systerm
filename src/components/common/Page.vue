<template>
  <!-- 翻页 -->
  <nav class="text-right">
    <ul class="pagination" style="margin-top: 0px;">
      <li @click="setCurrent(1)"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
      <li v-for="p in grouplist" :class="{'active': current == p.val}" class="pageshow">
        <a href="javascript:;" @click="setCurrent(p.val)">{{p.text}}</a>
      </li>
      <li @click="setCurrent(current + 1)"><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
      <li><a href="javascript:void(0)">共{{lastPage}}页</a></li>
    </ul>
  </nav>
</template>
<style scoped>
  li:hover {
    cursor: pointer;
  }
</style>
<script>
  export default{
    name: 'page',
    props: {
      lastPage: 4,
//     数据总条数
      total: {
        type: Number,
        default: 80
      },
//     每页显示条数
      display: {
        type: Number,
        default: 10
      },
//     当前页码
      current: {
        type: Number,
        default: 1
      },
//     分页条数 -- 奇数
      pagegroup: {
        type: Number,
        default: 5,
        coerce: function (v) {
          v = v > 0 ? v : 5
          return v % 2 === 1 ? v : v + 1
        }
      }
    },
    computed: {
//       总页数
      page: function () {
        return Math.ceil(this.total / this.display)
      },
//       获取分页页码
      grouplist: function () {
        var len = this.page
        var temp = []
        var list = []
        var count = Math.floor(this.pagegroup / 2)
        var center = this.current
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len})
          }
          return temp
        }
        while (len--) {
          temp.push(this.page - len)
        }
        var idx = temp.indexOf(center)
        if ((idx < count) && (center = center + count - idx)) {
          (this.current > this.page - count) && (center = this.page - count)
        }
        temp = temp.splice(center - count - 1, this.pagegroup)
        do {
          var t = temp.shift()
          list.push({
            text: t,
            val: t
          })
        } while (temp.length)
        if (this.page > this.pagegroup) {
          if ((this.current > count + 1)) {
            list.unshift({
              text: '...',
              val: list[0].val - 1
            })
          }
          if (this.current < this.page - count) {
            list.push({text: '...', val: list[list.length - 1].val + 1})
          }
        }
        return list
      }
    },
    methods: {
      setCurrent: function (idx) {
        if (this.current !== idx && idx > 0 && idx < this.page + 1) {
          this.current = idx
          this.$dispatch('pagechange', this.current)
        }
      }
    }
  }
</script>
