<template>
  <!--单条数据 -->
  <table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="text-center">
      <th v-for="value in tableHeader">
        {{value}}
      </th>
      <th v-if="operate">操作</th>
    </tr>
    </thead>
    <tbody>
    <tr class="text-center" v-for="entry in  tableData" track-by="$index" :id="[entry.id ? entry.id : '']">
      <td v-for="value in tableHeader">
        {{entry[$key]}}
      </td>
      <td  v-if="operate">
        <slot name="operate">
          <list-validate :list.sync="tableData" :flag.sync="validateFlag" v-if="entry.check==='未审核'||entry.check_status==='未审核'"></list-validate>
          <span class="btn btn-primary btn-sm" @click="edit" v-if="entry.check==='未审核'||entry.check_status==='未审核'">编辑</span>
        </slot>
    </tr>
    </tbody>
  </table>
  <!--表格详情列表-->
  <table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="text-center">
      <th v-for="value in  secondTableHeader">
        {{value}}
      </th>
    </tr>
    </thead>
    <tbody>
      <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
        <td>{{entry.goods_code}}</td>
        <td>{{entry.goods_name}}</td>
        <td v-if="entry.number">{{entry.number}}</td>
        <td v-if="entry.stock_now">{{entry.stock_now}}</td>
        <td v-if="entry.stock_system">{{entry.stock_system}}</td>
        <td v-if="entry.difference_number">{{entry.difference_number}}</td>
        <td>{{entry.unit}}</td>
        <td>{{entry.unit_specification}}</td>
      </tr>
    </tbody>
  </table>
  <!-- 翻页 -->
  <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
        :last-page="page.last_page"></page>
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
      secondTableHeader: [],
      tableData: [],
      detailList: [],
      page:{}
    },
    components: {
      Page: Page,
      Grid:  Grid,
      Count:  Count,
      ListValidate: ListValidate,
    },
    methods: {
      edit: function () {
        this.editFlag = true
      }
    },
    data: function () {
      return {
        editFlag: false,
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
</style>

