<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核被举报的用户
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="handle-box-1">
                    <el-input v-model="u_name" placeholder="用户名" class="handle-input mr10"></el-input>
                    <el-input v-model="u_phone" placeholder="用户手机号" class="handle-input mr10"></el-input>
                    <el-input v-model="u_email" placeholder="用户邮箱" class="handle-input mr10"></el-input>
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
                        value-format="yyyy-MM-dd"
                        >
                        <!-- <el-button @click="searchTime()">搜索</el-button> -->
                    </el-date-picker>
                    <el-button type="primary" class="searchTime" icon="el-icon-search" @click="searchTime()">按时间搜索</el-button>
                </div>
                <div class="handle-box-2">
                    <el-button
                        type="primary"
                        icon="el-icon-check"
                        class="handle-del mr10"
                        @click="agreeAllSelection()"
                    >批量拉黑用户</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="u_id_reported" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="u_name" label="用户名"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.u_icon"
                            :preview-src-list="[scope.row.u_icon]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="u_phone" label="用户手机号"></el-table-column>
                <el-table-column prop="u_email" label="用户邮箱"></el-table-column>
                <el-table-column prop="u_gender" label="用户性别"></el-table-column>
                <el-table-column prop="ur_content" label="被举报理由"></el-table-column>
                <el-table-column prop="ur_time" label="被举报时间"></el-table-column>
                <el-table-column label="审核操作" width="180" align="center">
                    <template slot-scope="scope">
                        <div class="checkAction">
                            <el-button
                                type="text"
                                icon="el-icon-check"
                                @click="handleAgree(scope.$index, scope.row)"
                            >拉黑</el-button>
                            <disreport-user :q_id="scope.row.ur_id" v-on:getData='getData'></disreport-user>
                        </div>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-close"
                            class="red"
                            @click="centerDialogVisible = true"
                        >不拉黑</el-button>
                        <el-dialog
                            title="驳回用户举报的理由"
                            :visible.sync="centerDialogVisible"
                            width="50%"
                            center
                            @close='closeDialog'
                            :close-on-click-modal='false'>
                            <el-input
                                type="textarea"
                                :rows="6"
                                placeholder="请输入驳回用户举报理由"
                                v-model="ur_reason">
                            </el-input>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="centerDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="centerDialogVisible = false;handleDisagree(scope.$index, scope.row);">确 定</el-button>
                            </span>
                        </el-dialog> -->
                    </template>
                </el-table-column>
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
import disreportUser from './module/disreportUser.vue'
export default {
    components:{
        disreportUser
    },
    data() {
        return {
            centerDialogVisible:false,
            page:1,
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
            }],disabledDate: (time) => { //今天之前的日期可选
                    return time.getTime() > Date.now()
                }},
            datevalue: '',
            startTime:'',
            endTime:'',
            agreeList:[],
            disagreeList:[],
            u_name:'',
            u_phone:'',
            state:'',
            u_email:'',
            ur_reason:'',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        closeDialog(){
            this.ur_reason=''
        },
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
                u_name:this.u_name,
                u_phone:this.u_phone,
                state:this.state,
                u_email:this.u_email,
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getreportuser',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("被举报用户列表",res);
                if(res.data.resultCode==1002||res.data.resultCode==1003||res.data.resultCode==1004){
                    _this.$message({
                        message: '登录失效，请重新登录',
                        type: 'warning'
                    });
                }
                else if(res.data.resultCode==20007){
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
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleAgree(index, row) {
            this.$confirm('确定拉黑用户？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.idx = index;
                    this.form = row;
                    // console.log('单条同意',index,row)
                    let data = {
                        token: window.sessionStorage.getItem('token'),
                        ur_id:row.ur_id
                    }
                    let _this=this
                    console.log(data)
                    this.$axios({
                        method: "post",
                        url: 'administrator/agreereportUser',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        // console.log("单条同意",res);
                        if(res.data.resultCode==20034){
                            _this.getData()
                            _this.$message.success('处理成功')
                            // location.reload()
                        }
                        else if(res.data.resultCode==20035){
                            _this.$message.error('审核失败')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                })
                .catch(() => {});
        },
        handleDisagree(index, row) {
            this.idx = index;
            this.form = row;
            console.log(index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                ur_id:row.ur_id,
                ur_reason:this.ur_reason
            }
            let _this=this
            if(this.ur_reason==''){
                _this.$message.error('驳回理由不能为空');
                return
            }
            this.$axios({
                method: "post",
                url: 'administrator/disagreereportuser',
                data: _this.$Qs.stringify(data)
            })
            .then(function(res) {
                // console.log("单条不同意",res);
                if(res.data.resultCode==20034){
                    _this.getData()
                    _this.$message.success('处理成功')
                    // location.reload()
                }
                else if(res.data.resultCode==20035){
                    _this.$message.error('审核失败')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 批量同意
        agreeAllSelection() {
            const length = this.multipleSelection.length;
            let ids = '';
            this.agreeList = this.multipleSelection;
            // console.log('同意列表',this.agreeList)
            for (let i = 0; i < length; i++) {
                ids += this.agreeList[i].ur_id + ',';
            }
            console.log('批量',ids)
            let data = {
                token: window.sessionStorage.getItem('token'),
                ur_id:ids
            }
            let _this=this
            if(ids==''){
                _this.$message.error('请先选择要拉黑的用户')
                return
            }
            // console.log(data)
            this.$confirm('确定拉黑用户？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: "post",
                        url: 'administrator/agreereportUser',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        // console.log("批量同意",res);
                        if(res.data.resultCode==20034){
                            _this.getData()
                            _this.$message.success('处理成功')
                            // location.reload()
                        }
                        else if(res.data.resultCode==20035){
                            _this.$message.error('审核失败')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    }) 
                })
                .catch(() => {});
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
.handle-box-2{
    display: flex;
    margin-top: 10px;
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
.checkAction{
    display: flex;
    justify-content: space-around;
}
</style>
