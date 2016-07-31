<template>
  <!--表格 -->
  <table class="table table-striped table-bordered table-hover" v-if="!tabFlag">
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
          <list-validate :list.sync="tableData" :flag.sync="validateFlag" v-if="entry.checked==='未审核'"></list-validate>
          <list-finish  :list.sync="tableData"  v-if="entry.checked=='已审核'" ></list-finish>
          <span class="btn btn-info btn-sm" @click="detail($event)">查看</span>
          <list-delete :delete-data.sync="tableData"  v-if="entry.checked==='未审核'"></list-delete>
        </slot>
      </td>
    </tr>
    </tbody>
  </table>
  <!-- 翻页 -->
  <page :total="page.total" :current.sync="page.current_page" :display="page.per_page" :last-page="page.last_page" v-if="!tabFlag && tableData.length>0"></page>
</template>
<script>
  import ListDelete from '../common/ListDelete'
  import ListValidate from '../common/ListValidate'
  import ListFinish from '../common/ListFinish'
  import Page from  '../common/Page'
  import Count from '../common/Count'
  export default{
    name:'summary',
    props: {
      tableHeader: [],
      tableData: [],
      page:{},
      operate: false
    },
    events: {
//     刪除請求
      delete: function(id) {
       this.$dispatch('deleteFromApi',id)
      },
//    审核請求
      check: function (id) {
        this.$dispatch('checkFromApi',id)
      },
//    完成請求
      finish: function (id) {
        this.$dispatch('finishFromApi',id)
      }
    },
    components: {
      ListDelete: ListDelete,
      ListValidate: ListValidate,
      ListFinish: ListFinish,
      Page: Page,
      Count: Count
    },
    methods:{
//    查看详情
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$dispatch("gotoDetail",detailId)
      },
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

