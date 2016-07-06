<template>
  <!--表格 -->
  <table class="table table-striped table-bordered table-hover">
    <thead>
    <tr class="text-center">
      <th v-for="value in tableHeader">
        {{value}}
      </th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr class="text-center" v-for="entry in  tableData" track-by="$index" :id="[entry.id ? entry.id : '']">
      <td v-for="value in tableHeader">
        {{entry[$key]}}
      </td>
      <td>
        <slot name="operate">
          <list-validate :list.sync="tableData" :flag.sync="validateFlag" v-if="entry.check==='未审核'||entry.check_status==='未审核'"></list-validate>
          <list-finish  :list.sync="tableData"  v-if="entry.check==='已审核'||entry.check_status==='已审核'" ></list-finish>
          <span class="btn btn-info btn-sm" @click="detail($event)">查看</span>
          <list-delete :delete-data.sync="tableData"></list-delete>
        </slot>
    </tr>
    </tbody>
  </table>
  <!-- 翻页 -->
  <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
        :last-page="page.last_page">
  </page>
</template>
<script>
  import ListDelete from '../common/ListDelete'
  import ListValidate from '../common/ListValidate'
  import ListFinish from '../common/ListFinish'
  import Page from  '../common/Page'
  export default{
    name:'summary',
    props: {
      tableHeader: [],
      tableData: [],
      page:{},
      detailUrl:''
    },
    components: {
      ListDelete: ListDelete,
      ListValidate: ListValidate,
      ListFinish: ListFinish,
      Page: Page,
    },
    methods:{
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + detailId
      }
    },
    data: function () {
      return {

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

