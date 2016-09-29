<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li class="active"><a v-link="{ path: '/admin/dataCenter/member/rechargeList'}"> 会员充值统计表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/member/informationList'}"> 会员基本信息统计表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/member/consumptionList'}"> 会员消费明细表</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>会员卡号</label>
              <input type="text" class="form-control" placeholder="请输入卡号" v-model="searchData.vip_card_number">
            </div>
            <div class="form-group  ml10">
              <label>会员姓名</label>
              <input type="text" class="form-control" placeholder="请输入姓名" v-model="searchData.name">
            </div>
            <span class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="searchCancel()">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
            <a v-link="{ path: '/admin/dataCenter/member/rechargeListDetail'}" class="btn btn-primary spanblocks fr mr10">明细</a>
          </form>
        </div>

        <!-- 统计表格 -->
        <table class="table table-striped table-border table-hover mt20" :data="onedata">
          <tbody>
          <tr>
            <td>
              <span class="pr50">充值总额：{{onedata.total_sum}}</span>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- 列表渲染表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="productOperate"></grid>

        <!--翻页-->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page' v-if="listdata.length>0"></page>

      </div>
    </div>
  </div>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>

</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftDatacenter from '../../common/LeftDataCenters'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      ErrorTip: ErrorTip,
      LeftDatacenter: LeftDatacenter
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getListData(currentpage)
      }
    },
    ready: function () {
//      获取列表数据
      this.getListData(1)
//      获取单条汇总数据
      this.getOneData(1)
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/member/recharge-list'
        var data = {
          vip_card_number: self.searchData.vip_card_number,
          name: self.searchData.name,
          page: page
        }
        getDataFromApi(url,data,function(response){
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        },function(err){})
      },
//      获取单条数据
      getOneData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/member/recharge-list/total'
        var data = {
          vip_card_number: self.searchData.vip_card_number,
          name: self.searchData.name
        }
        getDataFromApi(url,data,function(response){
          self.onedata = response.data.body.list
          self.onedata.total_sum ='￥' +  (self.onedata.total_sum * 0.01).toFixed(2)
        },function(err){})
      },
//      搜索
      searchMethod: function(page){
        this.getListData(page)
        this.getOneData()
      },
//      撤销搜索
      searchCancel: function(){
        var self = this
        self.searchData.vip_card_number = ''
        self.searchData.name = ''
        this.getListData(1)
        this.getOneData()
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.total_sum != '') {
            value.total_sum = '￥' + (value.total_sum * (0.01)).toFixed(2)
          }
          if(value.status == 1){
            value.status ='启用'
          }else{
            value.status ='禁用'
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/member/recharge-list'
        var data =
          'name=' + this.searchData.name + '&' +
          'vip_card_number=' + this.searchData.vip_card_number
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        listdata: [],
        onedata: [],
        providerList: [],
        gridColumns: {
          vip_card_number: '会员卡号',
          name: '会员姓名',
          status: '会员状态',
          store_name: '充值门店',
          total_sum: '充值金额'
        },
        productOperate: false,
        searchData: {
          vip_card_number: '',
          name: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
