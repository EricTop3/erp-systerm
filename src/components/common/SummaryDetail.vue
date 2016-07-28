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
        <td v-if="entry.consumable_code">{{entry.consumable_code}}</td>
        <td v-if="entry.consumable_name">{{entry.consumable_name}}</td>
        <td v-if="entry.name===null">{{entry.name}}</td>
        <td v-if="entry.amount && editFlag===false">{{entry.amount}}</td>
        <td v-if="entry.amount && editFlag===true"><count :count="entry.amount"></count></td>
        <td v-if="entry.number && editFlag===false">{{entry.number}}</td>
        <td v-if="entry.number && editFlag===true"><count :count="entry.number"></count></td>
        <td v-if="entry.stock_now!=null">{{entry.stock_now}}</td>
        <td v-if="entry.stock_system !=null">{{entry.stock_system}}</td>
        <td v-if="entry.difference_amount!=null">{{entry.difference_amount}}</td>
        <td>{{entry.unit}}</td>
        <td>{{entry.unit_specification}}</td>
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
            <td v-if="entry.goods_code">{{entry.goods_code}}</td>
            <td v-if="entry.goods_name">{{entry.goods_name}}</td>
            <!--采购-->
            <td v-if="entry.item_code!= underdefind">{{entry.item_code}}</td>
            <td v-if="entry.item_code!= underdefind">{{entry.item_name}}</td>
            <td v-if="entry.unit_specification!= underdefind">{{entry.unit_specification}}</td>
            <td v-if="entry.current_stock != underdefind">{{entry.current_stock}}</td>
            <td v-if="entry.demand_amount!=underdefind">{{entry.demand_amount}}</td>
            <td v-if="entry.main_reference_value!=underdefind">{{entry.main_reference_value}}</td>
            <td v-if="entry.purchase_unit_price!=underdefind">{{entry.purchase_unit_price| priceChange}}</td>
            <td v-if="entry.reference_number!==underfind">{{entry.reference_number}}</td>
            <td v-if="entry.consumable_code != underdefind">{{entry.consumable_code}}</td>
            <td v-if="entry.consumable_name">{{entry.consumable_name}}</td>
            <td v-if="entry.recipient_amount">{{entry.recipient_amount}}</td>
            <!--<td v-if="entry.recipient_amount && editFlag===true"><count :count="entry.recipient_amount"></count></td>-->
            <td v-if="entry.distribution_amount">{{entry.distribution_amount}}</td>
            <td v-if="entry.current_amount">{{entry.current_amount}}</td>
          </tr>
          </tbody>
        </table>
        <!-- 翻页 -->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page"></page>
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
            <td v-if="entry.goods_code">{{entry.goods_code}}</td>
            <td v-if="entry.goods_name">{{entry.goods_name}}</td>
            <!--采购-->
            <td v-if="entry.item_code!= underdefind">{{entry.item_code}}</td>
            <td v-if="entry.item_code!= underdefind">{{entry.item_name}}</td>
            <td v-if="entry.unit_specification!= underdefind">{{entry.unit_specification}}</td>
            <td v-if="entry.current_stock != underdefind">{{entry.current_stock}}</td>
            <td v-if="entry.demand_amount!=underdefind">{{entry.demand_amount}}</td>
            <td v-if="entry.main_reference_value!=underdefind">{{entry.main_reference_value}}</td>
            <td v-if="entry.purchase_unit_price!=underdefind">{{entry.purchase_unit_price| priceChange}}</td>
            <td v-if="entry.reference_number!==underfind">{{entry.reference_number}}</td>
            <td v-if="entry.consumable_code != underdefind">{{entry.consumable_code}}</td>
            <td v-if="entry.consumable_name">{{entry.consumable_name}}</td>
            <td v-if="entry.recipient_amount">{{entry.recipient_amount}}</td>
            <!--<td v-if="entry.recipient_amount && editFlag===true"><count :count="entry.recipient_amount"></count></td>-->
            <td v-if="entry.distribution_amount">{{entry.distribution_amount}}</td>
            <td v-if="entry.current_amount">{{entry.current_amount}}</td>
          </tr>
          </tbody>
        </table>
        <!-- 翻页 -->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page"></page>
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

