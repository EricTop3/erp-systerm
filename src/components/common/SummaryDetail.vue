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
    <tr class="text-center"  track-by="$index" :id="[tableData.id ? tableData.id : '']">
      <td v-for="value in tableHeader">
        {{tableData[$key]}}
      </td>
      <td  v-if="operate">
        <slot name="operate">
          <list-validate :list.sync="tableData" :flag.sync="validateFlag" v-if="tableData.checked==='未审核'"></list-validate>
          <span class="btn btn-primary btn-sm" @click="edit" v-if="tableData.checked==='未审核'">编辑</span>
        </slot>
    </tr>
    </tbody>
  </table>
  <!--表格详情列表-->
  <table class="table table-striped table-bordered table-hover" v-if="!tabFlag">
    <thead>
    <tr class="text-center">
      <th v-for="value in  secondTableHeader">
        {{value}}
      </th>
    </tr>
    </thead>
    <tbody>
      <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
        <!--<td v-if="entry.consumable_code">{{entry.consumable_code}}</td>-->
        <!--<td v-if="entry.consumable_name">{{entry.consumable_name}}</td>-->
        <!--<td v-if="entry.name===null">{{entry.name}}</td>-->
        <!--<td v-if="entry.amount && editFlag===false">{{entry.amount}}</td>-->
        <!--<td v-if="entry.amount && editFlag===true"><count :count="entry.amount"></count></td>-->
        <!--<td v-if="entry.number && editFlag===false">{{entry.number}}</td>-->
        <!--<td v-if="entry.number && editFlag===true"><count :count="entry.number"></count></td>-->
        <!--<td v-if="entry.stock_now!=null">{{entry.stock_now}}</td>-->
        <!--<td v-if="entry.stock_system !=null">{{entry.stock_system}}</td>-->
        <!--<td v-if="entry.difference_amount!=null">{{entry.difference_amount}}</td>-->
        <!--<td>{{entry.unit}}</td>-->
        <!--<td>{{entry.unit_specification}}</td>-->
        <!--库存出库汇总明细-->
        <td v-if="entry.goods_code!=undefind">{{entry.goods_code}}</td>
        <td v-if="entry.goods_name!=undefind">{{entry.goods_name}}</td>
        <td v-if="entry.requisition_amount!=undefind">{{entry.requisition_amount}}</td>
        <td v-if="entry.distribution_info.amount!=undefind">{{entry.distribution_info.amount}}</td>
        <td v-if="entry.unit_name!=undefind">{{entry.unit_name}}</td>
        <td v-if="entry.unit_specification!=undefind">{{entry.unit_specification}}</td>
        <td v-if="entry.distribution_info.code!=undefind">{{entry.distribution_info.code}}</td>
        <!---->
      </tr>
    </tbody>
  </table>
  <!-- 翻页 -->
  <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
        :last-page="page.last_page" v-if="!tabFlag"></page>
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
            <td v-if="entry.item_code">{{entry.item_code}}</td>
            <td v-if="entry.item_name">{{entry.item_name}}</td>
            <td v-if="entry.unit_name">{{entry.unit_name}}</td>
            <!--采购单详情-->
            <td v-if="entry.specification_unit!=undefind">{{entry.specification_unit}}</td>
            <td v-if="entry.purchase_unit_name!=undefind">{{entry.purchase_unit_name}}</td>
            <td v-if="entry.unit_specification!=undefind">{{entry.unit_specification}}</td>
            <td v-if="entry.current_stock!=undefind">{{entry.current_stock}}</td>
            <td v-if="entry.required_amount!=undefind">{{entry.required_amount}}</td>
            <td v-if="entry.pruchase_amount">{{entry.pruchase_amount}}</td>
            <td v-if="entry.purchase_unit_price!=undefind">{{entry.purchase_unit_price|priceChange}}</td>
            <td v-if="entry.purchase_unit_price">{{entry.reference_number}}</td>
            <!--采购收货详情-->
            <td v-if="entry.stock!=undefind">{{entry.stock}}</td>
            <td v-if="entry.main_reference_value!=undefind">{{entry.main_reference_value}}</td>
            <td v-if="entry.received_amount!=undefind">{{entry.received_amount}}</td>
            <td v-if="entry.additional_amount!=undefind">{{entry.additional_amount}}</td>
            <td v-if="entry.refund_amount!=undefind">{{entry.refund_amount}}</td>
            <td v-if="entry.unit_price!=undefind">{{entry.unit_price|priceChange}}</td>
            <td v-if="entry.amount!=undefind">{{entry.amount}}</td>
            <td v-if="entry.price!=undefind">{{entry.price}}</td>
            <td v-if="entry.origen_source!=undefind">{{entry.origen_source}}</td>
            <!--配送出库详情-->
            <td v-if="entry.goods_code!=undefind">{{entry.goods_code}}</td>
            <td v-if="entry.goods_name!=undefind">{{entry.goods_name}}</td>
            <td v-if="entry.origin_stock_amount!=undefind">{{entry.origin_stock_amount}}</td>
            <td v-if="entry.target_stock_amount!=undefind">{{entry.target_stock_amount}}</td>
            <td v-if="entry.distribution_required_amount!=undefind">{{entry.distribution_required_amount}}</td>
            <td v-if="entry.distribution_send_amount!=undefind">{{entry.distribution_send_amount}}</td>
            <td v-if="entry.distribution_purchase_unit!=undefind">{{entry.distribution_purchase_unit}}</td>
            <td v-if="entry.distribution_unit!=undefind">{{entry.distribution_unit}}</td>
            <td v-if="entry.distribution_reference_number!=undefind">{{entry.distribution_reference_number}}</td>
            <!--工厂生产单-->
            <td v-if="entry.factory_unit!=undefind">{{entry.factory_unit}}</td>
            <td v-if="entry.factory_total_stock!=undefind">{{entry.factory_total_stock}}</td>
            <td v-if="entry.factory_required_amount!=undefind">{{entry.factory_required_amount}}</td>
            <td v-if="entry.factory_product_amount!=undefind">{{entry.factory_product_amount}}</td>
            <td v-if="entry.factory_origen_number!=undefind">{{entry.factory_origen_number}}</td>
          </tr>
          </tbody>
        </table>
        <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
        <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
              <!--:last-page="page.last_page"></page>-->
      </div>

      <!-- 入库汇总 -->
      <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
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
            <td v-if="entry.item_code">{{entry.item_code}}</td>
            <td v-if="entry.item_name">{{entry.item_name}}</td>
            <td v-if="entry.unit_name">{{entry.unit_name}}</td>
            <!--采购单详情-->
            <td v-if="entry.specification_unit!=undefind">{{entry.specification_unit}}</td>
            <td v-if="entry.purchase_unit_name!=undefind">{{entry.purchase_unit_name}}</td>
            <td v-if="entry.unit_specification!=undefind">{{entry.unit_specification}}</td>
            <td v-if="entry.current_stock!=undefind">{{entry.current_stock}}</td>
            <td v-if="entry.required_amount!=undefind">{{entry.required_amount}}</td>
            <td v-if="entry.pruchase_amount">{{entry.pruchase_amount}}</td>
            <td v-if="entry.purchase_unit_price!=undefind">{{entry.purchase_unit_price|priceChange}}</td>
            <td v-if="entry.purchase_unit_price">{{entry.reference_number}}</td>
            <!--采购收货详情-->
            <td v-if="entry.stock!=undefind">{{entry.stock}}</td>
            <td v-if="entry.main_reference_value!=undefind">{{entry.main_reference_value}}</td>
            <td v-if="entry.received_amount!=undefind">{{entry.received_amount}}</td>
            <td v-if="entry.additional_amount!=undefind">{{entry.additional_amount}}</td>
            <td v-if="entry.refund_amount!=undefind">{{entry.refund_amount}}</td>
            <td v-if="entry.unit_price!=undefind">{{entry.unit_price}}</td>
            <td v-if="entry.amount!=undefind">{{entry.amount}}</td>
            <td v-if="entry.price!=undefind">{{entry.price}}</td>
            <td v-if="entry.origen_source!=undefind">{{entry.origen_source}}</td>
            <td v-if="entry.demanding_number">{{entry.demanding_number}}</td>
            <td v-if="entry.distribution_number">{{entry.distribution_number}}</td>
            <!--配送出库详情-->
            <td v-if="entry.goods_code!=undefind">{{entry.goods_code}}</td>
            <td v-if="entry.goods_name!=undefind">{{entry.goods_name}}</td>
            <td v-if="entry.origin_stock_amount!=undefind">{{entry.origin_stock_amount}}</td>
            <td v-if="entry.target_stock_amount!=undefind">{{entry.target_stock_amount}}</td>
            <td v-if="entry.distribution_required_amount!=undefind">{{entry.distribution_required_amount}}</td>
            <td v-if="entry.distribution_send_amount!=undefind">{{entry.distribution_send_amount}}</td>
            <td v-if="entry.distribution_purchase_unit!=undefind">{{entry.distribution_purchase_unit}}</td>
            <td v-if="entry.distribution_unit!=undefind">{{entry.distribution_unit}}</td>
            <td v-if="entry.distribution_reference_number!=undefind">{{entry.distribution_reference_number}}</td>
            <!--工厂生产单-->
            <td v-if="entry.factory_unit!=undefind">{{entry.factory_unit}}</td>
            <td v-if="entry.factory_total_stock!=undefind">{{entry.factory_total_stock}}</td>
            <td v-if="entry.factory_required_amount!=undefind">{{entry.factory_required_amount}}</td>
            <td v-if="entry.factory_product_amount!=undefind">{{entry.factory_product_amount}}</td>
            <td v-if="entry.factory_origen_number!=undefind">{{entry.factory_origen_number}}</td>
          </tr>
          </tbody>
        </table>
        <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
        <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
              <!--:last-page="page.last_page"></page>-->
      </div>
    </div>
  </div>
  </div>
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
      tabFlag: false,
      page: []
    },
    components: {
      Page: Page,
      Grid:  Grid,
      Count:  Count,
      ListValidate: ListValidate,
    },
    events: {
//    审核
      check: function (id){
        console.log(id)
        this.$dispatch("checkFromApi",id)
      },
      finishEdit: function () {
        this.editFlag = false
      }
    },
    methods: {
      edit: function () {
        this.editFlag = true
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
        editFlag: false,
        operate: true,
        detailModal: true,
        summaryModal: false,
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

