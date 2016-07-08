<template>
  <!-- 表格 单条数据 -->
  <grid :data="tableData" :columns="tableHeader" :operate="gridOperate">
    <div slot="operateList">
      <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-audit-templ">审核</span>
      <span class="btn btn-primary btn-sm">编辑</span>
    </div>
  </grid>
  <!--表格详情列表-->
  <table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="text-center">
      <th v-for="value in  tableHeader">
        {{value}}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
      <td>{{entry.goods_code}}</td>
      <td>{{entry.goods_name}}</td>
      <td v-if="editFlag"><count :count.sync="entry.number"></count></td>
      <td v-if="!editFlag">{{entry.number}}</td>
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
  import Grid from '../common/Grid'
  import Page from  '../common/Page'
  import Count from  '../common/Count'
  export default{
    name:'summary-detail',
    props: {
      gridOperate: true,
      tableHeader: [],
      tableData: [],
      detailList: [],
      page:{}
    },
    components: {
      Page: Page,
      Grid:  Grid,
      Count:  Count
    },
    data: function () {
      return {
        editFlag: true
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

