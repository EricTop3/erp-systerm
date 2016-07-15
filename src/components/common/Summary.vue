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
          <list-delete :delete-data.sync="tableData"></list-delete>
        </slot>
    </tr>
    </tbody>
  </table>
  <!-- 翻页 -->
  <page :total="page.total" :current.sync="page.current_page" :display="page.per_page" :last-page="page.last_page" v-if="!tabFlag"></page>
  <!--有列表切换的时候的情况-->
  <div v-if="tabFlag">
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
      <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
      <!-- 入库明细 -->
      <div role="tabpanel" class="tab-pane active" v-if="detailModal">
        <table class="table table-striped table-bordered table-hover">
          <thead>
          <tr class="text-center">
            <th v-for="value in  tableHeader">
              {{value}}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="entry in tableData" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td v-if="entry.goods_code">{{entry.goods_code}}</td>
            <td v-if="entry.goods_name">{{entry.goods_name}}</td>
            <td>{{entry.demanding_number}}</td>
            <td>{{entry.distribution_number}}</td>
            <td><count :count="entry.now_number"></count></td>
            <td>{{entry.unit}}</td>
            <td>{{entry.unit_specification}}</td>
            <td>{{entry.store_distribution_id}}</td>
          </tr>
          </tbody>
        </table>
        <!-- 翻页 -->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page"></page>
      </div>

      <!-- 入库汇总 -->
      <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <th v-for="value in  tableHeader">
                {{value}}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="entry in summaryData" track-by="$index" :id="[entry.id ? entry.id : '']">
              <td>{{entry.goods_code}}</td>
              <td>{{entry.goods_name}}</td>
              <td>{{entry.demanding_number}}</td>
              <td>{{entry.distribution_number}}</td>
              <td>{{entry.now_number}}</td>
              <td>{{entry.unit}}</td>
              <td>{{entry.unit_specification}}</td>
              <td>{{entry.store_distribution_id}}</td>
            </tr>
            </tbody>
          </table>
          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
    </div>
  </div>
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
      summaryData: [],
      page:{},
      detailUrl:'',
      tabFlag: false,
    },
    components: {
      ListDelete: ListDelete,
      ListValidate: ListValidate,
      ListFinish: ListFinish,
      Page: Page,
      Count: Count
    },
    methods:{
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + detailId
      },
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))){
          case 1:
            this.detailModal = true
            this.summaryModal = false
            this.$dispatch('detail')
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.$dispatch('summary')
        }
      }
    },
    data: function () {
      return {
        detailModal: true,
        summaryModal: false
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

