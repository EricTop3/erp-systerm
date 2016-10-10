  <template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货单汇总</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>单号</label>
          <input type="text" class="form-control" placeholder="请输入单号" v-model="query.order_number">
        </div>
        <div class="form-group ml10">
          <label>状态</label>
          <select class="form-control" v-model="query.checked">
            <option value="">请选择</option>
            <option value="0">未审核</option>
            <option value="1">已审核</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control" v-model="query.creator_id">
            <option value="">请选择</option>
            <option v-for="item in creators" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单时间段</label>
          <date-picker :value.sync="query.start_time" :time-text="timetext1"></date-picker>
          -
          <date-picker :value.sync="query.end_time" :time-text="timetext2"></date-picker>
        </div>
        <div class="form-group ml10">
          <label>送货时间段</label>
          <date-picker :value.sync="query.start_receive_time" :time-text="timetext1"></date-picker>
          -
          <date-picker :value.sync="query.end_receive_time" :time-text="timetext2"></date-picker>
        </div>
        <span class="btn btn-info" @click="search()" >搜索</span>
        <span class="btn btn-warning" @click="cancel()" >取消搜索</span>
        <a v-link="{ path: '/site/instock/GoodsApply'}"><span class="btn btn-primary">申请要货</span></a>
      </form>
    </div>
    <!--汇总列表-->
    <summary
             :table-data="list"
             :table-header="gridColumns"
             :page="page"
             :check-url = 'checkUrl'
             :finish-url="checkUrl"
             :finish-flag="true"
             :has-validate-authority="true"
             :has-look-authority = "true"
             :has-finish-authority="true"
             :has-delete-authority= "true">
    </summary>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Summary from '../../common/Summary'
  import ListValidate from '../../common/ListValidate'
  import ListDelete from '../../common/ListDelete'
  import DatePicker from '../../common/DatePicker'
  import { requestUrl,token,searchRequest,exchangeData,deleteRequest,checkRequest,finishRequest, error,getDataFromSiteApi} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Summary: Summary,
      alert: alert,
      ListValidate: ListValidate,
      ListDelete: ListDelete,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var data = {
          page: currentpage
        }
        var self = this
        getDataFromSiteApi(requestUrl + '/front-system/stock/enquiry',data,function(response){
          console.log( response.data.body.pagination)
          self.page = response.data.body.pagination
          self.list = response.data.body.list
          exchangeData(self.list)
        })
      },
//     审核失败
      checkFail: function() {

      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestUrl +'/front-system/stock/enquiry/'+ id,function(response){
          self.listData(1)
        })
      },
//      查看详情
      gotoDetail: function (id){
        window.location.href = '#!/site/instock/GoodsApplyNum/'+ id
      }
    },
    ready: function () {
      var self = this
      //      获取制单人
      getDataFromSiteApi( requestUrl + '/front-system/account',{},function(response){
        self.creators = response.data.body.list
      })
      this.listData(16)
    },
    methods: {
//    生产出库-列表数据渲染
      listData: function (page) {

        this.$http({
          url: requestUrl + '/front-system/stock/enquiry',
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          exchangeData(this.list)
        }, function (err) {
          error(err)
        })
      },
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.start_receive_time = ''
        this.query.end_receive_time = ''
        this.query.order_number = ''
        this.query.checked = ''
        this.query.creator_id = ''
        this.listData(1)
      },
//      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/enquiry',
          {
            start_time: this.query.start_time,
            end_time: this.query.end_time,
            start_receive_time: this.query.start_receive_time,
            end_receive_time: this.query.end_receive_time,
            order_number: this.query.order_number,
            checked: this.query.checked,
            creator_id: this.query.creator_id,
            per_page: 16
          },
          function (response) {
            self.list = response.data.body.list
            self.page = response.data.body.pagination
            exchangeData(self.list)
          }
        )
      }
    },
    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        page: {},
        checkUrl: requestUrl + '/front-system/stock/enquiry/',
        showRight: false,
        creators: [],
        createPersonId: '',
        orderStartTime: '',
        orderEndTime: '',
        sendStartTime: '',
        sendEndTime: '',
        list: [],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '状态',
          creator: '制单人',
          auditor: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          amount: '要货数量'
        },
        query: {
          start_time: '',
          start_receive_time: '',
          end_time: '',
          end_receive_time: '',
          order_number: '',
          checked: '',
          creator_id: '',
          order_code: '',
          create_person: '',
          check: ''
        }
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
