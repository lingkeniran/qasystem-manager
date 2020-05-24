<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 查看已处理被举报回答列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> 
        <div class="container">
            <div class="handle-box">
                <div class="handle-box-1">
                    <el-input v-model="a_id" placeholder="管理员ID" class="handle-input mr10"></el-input>
                    <el-input v-model="a_name" placeholder="管理员名字" class="handle-input mr10"></el-input>
                    <el-input v-model="a_phone" placeholder="管理员手机号" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
                </div>
                <div class="block">
                    <el-date-picker
                        v-model="datevalue"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                        <!-- <el-button @click="searchTime()">搜索</el-button> -->
                    </el-date-picker>
                    <el-button type="primary" class="searchTime" icon="el-icon-search" @click="searchTime()">按时间搜索</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="ud_id" label="编号" width="60"></el-table-column>
                <el-table-column prop="a_id" label="管理员ID" width="90"></el-table-column>
                <el-table-column prop="a_name" label="管理员名字" width="100"></el-table-column>
                <el-table-column label="头像" align="center" width="80">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.a_icon"
                            :preview-src-list="[scope.row.a_icon]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="a_phone" label="管理员手机号" width="120"></el-table-column>
                <el-table-column prop="ud_content" label="操作"></el-table-column>
                <el-table-column prop="ud_time" label="处理时间" width="160"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            page:1,
            a_id:'',
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
            }]},
            datevalue: '',
            startTime:'',
            endTime:'',
            agreeList:[],
            disagreeList:[],
            a_name:'',
            a_phone:'',
            u_email:'',
            state:'',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        searchTime(){
            // console.log(picker)
            // console.log(this.datevalue)
            this.startTime=this.datevalue[0]
            this.endTime=this.datevalue[1]
            this.getData()
            // console.log('startTime',this.startTime,'endTime',this.endTime)
            // for (let i = 0; i < length; i++) {
            //     // ids.push( this.readList[i].um_id)
            //     times += this.datevalue[i]+ ',';
            // }
            // console.log(times)

        },
        searchUser(){
            this.getData()
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let data = {
                token: window.sessionStorage.getItem('token'),
                number:10,
                page:this.page,
                a_id:this.a_id,
                a_name:this.a_name,
                a_phone:this.a_phone,
                starttime:this.startTime,
                endtime:this.endTime,
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getdiary',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("日志",res);
                if(res.data.resultCode==1002||res.data.resultCode==1003||res.data.resultCode==1004){
                    _this.$message({
                        message: '登录失效，请重新登录',
                        type: 'warning'
                    });
                }else if(res.data.resultCode==20007){
                    _this.$message.info('查询完成，查询结果为空')
                    _this.tableData=res.data.data.list
                    // console.log(_this.tableData)
                    _this.pageTotal=res.data.data.totalRow
                }else{
                    _this.tableData=res.data.data.list
                    // console.log(_this.tableData)
                    _this.pageTotal=res.data.data.totalRow
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.page=val
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    /* display: flex; */
}
.handle-box-1{
    display: flex;
    margin-bottom: 10px;
}
.block{
    /* margin-left: 30px; */
    margin-right: 10px;
}
.searchTime{
    margin-left: 10px;
}
.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.qContent{
    height: 70px;
    /* white-space:nowrap; 规定段落中的文本不进行换行 */
    text-overflow:ellipsis; /*text-overflow 属性规定当文本溢出包含元素时发生的事情。ellipsis:显示省略符号来代表被修剪的文本。*/
    overflow:hidden;
    vertical-align:middle;
    display: flex;
    /* align-items: center; */
}
</style>
