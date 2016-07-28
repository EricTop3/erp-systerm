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
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="entry in tableData" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td v-if="entry.code">{{entry.code}}</td>
            <td v-if="entry.name">{{entry.name}}</td>
            <td v-if="entry.unit_name">{{entry.unit_name}}</td>
            <td v-if="entry.specification_unit">{{entry.specification_unit}}</td>
            <!--收货数量-->
            <td v-if="entry.stock!=undefind">{{entry.stock}}</td>
            <td v-if="entry.main_reference_value!=undefind">{{entry.main_reference_value}}</td>
            <td v-if="entry.received_amount!=undefind"><count :count.sync="entry.received_amount"></count>{{entry.unit_name}}</td>
            <td v-if="entry.additional_amount!=undefind"><count :count.sync="entry.additional_amount"></count>{{entry.unit_name}}</td>
            <td v-if="entry.refund_amount!=undefind"><count :count.sync="entry.refund_amount"></count>{{entry.unit_name}}</td>
            <td v-if="entry.received_price!=undefind"><count :count.sync="entry.received_price"></count>/{{entry.unit_name}}</td>
            <td v-if="entry.amount!=undefind"><count :count.sync="entry.amount"></count>{{entry.production_unit_name}}</td>
            <td v-if="entry.price!=undefind"><count :count.sync="entry.price"></count>/{{entry.production_unit_name}}</td>
            <td v-if="entry.origen_source!=undefind">{{entry.origen_source}}</td>
            <td v-if="entry.demanding_number">{{entry.demanding_number}}</td>
            <td v-if="entry.distribution_number">{{entry.distribution_number}}</td>
            <!--库存配送出库数量-->
            <td v-if="entry.send_stock!=undefind">{{entry.send_stock}}</td>
            <td>
              <slot name="operate">
                <list-delete :delete-data.sync="tableData" ></list-delete>
              </slot>
            </td>
          </tr>
          </tbody>
        </table>
        <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
        <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
              <!--:last-page="page.last_page"></page>-->
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
              <td v-if="entry.code">{{entry.code}}</td>
              <td v-if="entry.name">{{entry.name}}</td>
              <td v-if="entry.unit_name">{{entry.unit_name}}</td>
              <td v-if="entry.specification_unit">{{entry.specification_unit}}</td>
              <!--收货数量-->
              <td v-if="entry.stock!=undefind">{{entry.stock}}</td>
              <td v-if="entry.main_reference_value!=undefind">{{entry.main_reference_value}}</td>
              <td v-if="entry.received_amount!=undefind">{{entry.received_amount}}</td>
              <td v-if="entry.additional_amount!=undefind">{{entry.additional_amount}}</td>
              <td v-if="entry.refund_amount!=undefind">{{entry.refund_amount}}</td>
              <td v-if="entry.received_price!=undefind">{{entry.received_price}}</td>
              <td v-if="entry.amount!=undefind">{{entry.amount}}</td>
              <td v-if="entry.price!=undefind">{{entry.price}}</td>
              <td v-if="entry.origen_source!=undefind">{{entry.origen_source}}</td>
              <td v-if="entry.demanding_number">{{entry.demanding_number}}</td>
              <td v-if="entry.distribution_number">{{entry.distribution_number}}</td>
              <!--<td>{{20130516168}}</td>-->
            </tr>
            </tbody>
          </table>
          <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
          <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
                <!--:last-page="page.last_page"></page>-->
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
      tabFlag: false,
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

