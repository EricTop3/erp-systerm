<template>
  <!--单条数据 -->
  <table class="table table-striped table-bordered table-hover" style="margin-bottom:0px">
    <thead>
    <tr class="text-center">
      <th v-for="value in tableHeader">
        {{value}}
      </th>
      <th v-if="operate">操作</th>
    </tr>
    </thead>
    <tbody>
    <tr class="text-center"  track-by="$index" :id="[tableData.id ? tableData.id : '']">
      <td v-for="value in tableHeader">
        {{tableData[$key]}}
      </td>
      <td  v-if="operate">
        <slot name="operate">
          <list-validate :list.sync="tableData" :flag.sync="validateFlag" :check-url="checkUrl" v-if="tableData.checked==='未审核'"></list-validate>
          <span class="btn btn-primary btn-sm" @click="edit($event)" v-if="tableData.checked==='未审核' && isExist">编辑</span>
          <span class="btn btn-success btn-sm" @click="save($event)" v-if="tableData.checked==='未审核' && !isExist">保存</span>
        </slot>
      </td>
    </tr>
    </tbody>
  </table>
  <div class="notice">备注：{{tableData.note ? tableData.note : '无'}}</div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from  '../common/Page'
  import ListValidate from '../common/ListValidate'
  import Count from  '../common/Count'
  export default{
    name:'summary-detail',
    props: {
      gridOperate: true,
      tableHeader: [],
      tableData: [],
      editFlag: false,
      checkUrl: '',
    },
    components: {
      Page: Page,
      Grid:  Grid,
      Count:  Count,
      ListValidate: ListValidate,
    },
    events: {
      finishEdit: function () {
        this.editFlag = false
      }
    },
    methods: {
//      编辑
      edit: function (event) {
        this.isExist = false
        this.$dispatch('editGoods',event)
      },
//      保存
      save: function (event) {
        this.isExist = true
        this.$dispatch('saveGoods',event)
      }
    },
    data: function () {
      return {
        isExist: true,
        operate: true
      }
    }
  }
</script>
<style scoped>
  table thead tr th {
    text-align: center
  }

  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
  .notice {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-top: none;
    padding: 6px;
  }
</style>

