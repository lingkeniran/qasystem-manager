<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核新用户注册
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-check"
                    class="handle-del mr10"
                    @click="agreeAllSelection()"
                >批量审核通过</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-close"
                    class="handle-del mr10"
                    @click="disagreeAllSelection()"
                >批量审核不通过</el-button>
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
                </div>
                <el-button type="primary" icon="el-icon-search" @click="searchTime()">按时间搜索</el-button>
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
                <el-table-column prop="uri_id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="uri_name" label="用户名"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.uri_icon"
                            :preview-src-list="[scope.row.uri_icon]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="uri_phone" label="用户手机号"></el-table-column>
                <el-table-column prop="uri_email" label="用户邮箱"></el-table-column>
                <el-table-column prop="uri_gender" label="用户性别"></el-table-column>

                <el-table-column prop="uri_register_time" label="注册时间"></el-table-column>
                <el-table-column label="审核操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-check"
                            @click="handleAgree(scope.$index, scope.row)"
                        >通过</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-close"
                            class="red"
                            @click="handleDisagree(scope.$index, scope.row)"
                        >不通过</el-button>
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
export default {
    name: 'basetable',
    data() {
        return {
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
                }],
                disabledDate: (time) => { //今天之前的日期可选
                    return time.getTime() > Date.now()
                }
            },
            datevalue: '',
            startTime:'',
            endTime:'',
            agreeList:[],
            disagreeList:[],
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
        // 获取 easy-mock 的模拟数据
        getData() {
            let data = {
                token: window.sessionStorage.getItem('token'),
                number:10,
                page:this.page,
                starttime:this.startTime,
                endtime:this.endTime,
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getregisteruser',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("待审核注册用户列表",res);
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
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 同意用户注册
        handleAgree(index, row) {
            this.idx = index;
            this.form = row;
            // console.log('单条同意',index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                uri_id:row.uri_id
            }
            let _this=this
            // console.log(data)
            this.$axios({
                method: "post",
                url: 'administrator/agreeUser',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                // console.log("单条同意",res);
                if(res.data.resultCode==20032){
                    _this.getData()
                    _this.$message.success('处理成功')
                    // location.reload()
                }
                else if(res.data.resultCode==20033){
                    _this.$message.error('审核失败')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        // 不同意用户注册
        handleDisagree(index, row) {
            // 二次确认删除
            this.$confirm('确定要不通过用户注册吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.idx = index;
                    this.form = row;
                    // console.log('单条同意',index,row)
                    let data = {
                        token: window.sessionStorage.getItem('token'),
                        uri_id:row.uri_id
                    }
                    let _this=this
                    // console.log(data)
                    this.$axios({
                        method: "post",
                        url: 'administrator/disagreeuser',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        // console.log("单条不同意",res);
                        if(res.data.resultCode==20032){
                            _this.getData()
                            _this.$message.success('处理成功')
                            // location.reload()
                        }
                        else if(res.data.resultCode==20033){
                            _this.$message.error('审核失败')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                })
                .catch(() => {});
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
                ids += this.agreeList[i].uri_id + ',';
            }
            // console.log('单条同意',index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                uri_id:ids
            }
            let _this=this
            // console.log(data)
            this.$axios({
                method: "post",
                url: 'administrator/agreeUser',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                // console.log("批量同意",res);
                if(res.data.resultCode==20032){
                    _this.getData()
                    _this.$message.success('处理成功')
                    // location.reload()
                }
                else if(res.data.resultCode==20033){
                    _this.$message.error('审核失败')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        // 批量不同意
        disagreeAllSelection(){
            this.$confirm('确定要不通过用户注册吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    const length = this.multipleSelection.length;
                    let ids = '';
                    this.agreeList = this.multipleSelection;
                    // console.log('同意列表',this.agreeList)
                    for (let i = 0; i < length; i++) {
                        ids += this.agreeList[i].uri_id + ',';
                    }
                    // console.log('单条同意',index,row)
                    let data = {
                        token: window.sessionStorage.getItem('token'),
                        uri_id:ids
                    }
                    let _this=this
                    // console.log(data)
                    this.$axios({
                        method: "post",
                        url: 'administrator/disagreeuser',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        // console.log("批量同意",res);
                        if(res.data.resultCode==20032){
                            _this.getData()
                            // location.reload()
                        }
                        else if(res.data.resultCode==20033){
                            this.$message.error('审核失败')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                })
                .catch(() => {});
        },
        // 页面导航
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
    display: flex;
}
.block{
    margin-left: 30px;
    margin-right: 10px;
}
.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
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
</style>
