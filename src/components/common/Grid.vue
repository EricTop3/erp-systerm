<template>
  <div class="table-responsive">
     <table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="text-center">
      <th v-if="check"><label><input type="checkbox" @change="checkAllMethod()" v-model="checkAll" :disabled="data  && data.length<0" v-if="check && isCheckAll">全选</label></th>
      <th v-for="value in columns">
        {{value}}
      </th>
      <th v-if="operate">操作</th>
    </tr>
    </thead>
    <tbody v-if="!singleRowHide">
    <tr class="text-center" v-for="entry in data" track-by="$index" :id="[entry.id ? entry.id : '']" :type="[entry.type ? entry.type : '']">
      <td v-if="check"><input type="checkbox"  :id="[entry.id ? entry.id : '']" @change="singleCheck($event)"  v-model="entry.choice"></td>
      <td v-for="value in columns">
        {{entry[$key]}}
      </td>
      <td v-if="operate" :id="[entry.id ? entry.id : '']" :orderStatus="[entry.status ? entry.status : '']">
        <slot name="operateList">
          <span class="btn btn-primary btn-sm">充值</span>
          <span class="btn btn-info btn-sm" id="show-modal">编辑</span>
          <a v-link="{ name: 'member', params: { memberId: 123 }}"><span class="btn btn-warning btn-sm">查看明细</span></a>
        </slot>
      </td>
    </tr>
    </tbody>
    <tbody v-if="singleRowHide">
      <tr class="text-center" v-for="entry in data" track-by="$index" :id="[entry.id ? entry.id : '']" :type="[entry.type ? entry.type : '']"
          v-if="entry.is_today > 0 || entry.demand_amount > 0 || entry.amount > 0">
        <td v-for="value in columns">
          {{entry[$key]}}
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<script>
  import $ from 'jquery'
  var len = 0
  export default{
    name: 'grid',
    props: {
      data: {
        required: true,
      },
      singleRowHide: false,
      isCheckAll: true,
      isAddFlag: false,
      check: false,
      checkAll: false,
      singleChecked: false,
      columns: {
        type: Object
      },
      operate: Boolean
    },
    methods: {
      checkAllMethod: function () {
        var self = this
        this.isAddFlag = this.checkAll
        len = this.checkAll  ? this.data.length : 0
        console.log(len)

        $.each(this.data, function (index, val) {
          val.choice = self.checkAll
        })
        this.$dispatch('change-all-operate', this.checkAll)
        this.$dispatch('add-all-operate', this.checkAll)
      },
      singleCheck: function (e) {
        var currentObjCheck = $(e.currentTarget).prop('checked')
        var currentId = Number($(e.currentTarget).attr('id'))
        if (currentObjCheck === false) {
          this.checkAll = false
          --len
        } else {
          ++len
          this.isAddFlag = true
        }
        if (len === this.data.length && len != 0) {
          this.checkAll = true
        }
        if (len < 1) {
          this.isAddFlag = false
        }
        this.$dispatch('change-operate', currentId, currentObjCheck, e)
        this.$dispatch('change-add-operate', currentId, currentObjCheck, e)
      }
    }
  }
</script>
<style scoped>
  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }

</style>
