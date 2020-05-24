<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核被举报的回答
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="handle-box-1">
                    <el-input v-model="u_name" placeholder="用户名" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
                </div>
                <div class="handle-box-2">
                    <el-button
                        type="primary"
                        icon="el-icon-check"
                        class="handle-del mr10"
                        @click="agreeAllSelection()"
                    >批量屏蔽回答</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="u_name" label="用户" width="60"></el-table-column>
                <el-table-column prop="q_content" label="回答内容">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover">
                            <div v-html='scope.row.q_content'>{{scope.row.q_content}}</div>
                            <div class="qContent" slot="reference" v-html='scope.row.q_content'></div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="qr_content" label="被举报理由" width="160">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover">
                            <div>{{scope.row.qr_content}}</div>
                            <div class="qContent" slot="reference">{{scope.row.qr_content}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="qr_time" label="被举报时间" width="160"></el-table-column>
                <el-table-column label="审核操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div class="checkAction">
                            <el-button
                                type="text"
                                icon="el-icon-check"
                                @click="handleAgree(scope.$index, scope.row)"
                            >屏蔽</el-button>
                            <disreport-answer :q_id="scope.row.qr_id" v-on:getData='getData'></disreport-answer>
                        </div>
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
import disreportAnswer from './module/disreportAnswer.vue'
export default {
    name: 'basetable',
    components:{
        disreportAnswer
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
            datevalue: '',
            startTime:'',
            endTime:'',
            agreeList:[],
            disagreeList:[],
            u_name:'',
            u_phone:'',
            state:'',
            u_email:'',
            visible: false,
            qr_reason:'',
        };
    },
    created() {
        this.getData();
    },
    methods: {
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
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getreportreply',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
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
                console.log("被举报回答列表",res);
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
            this.$confirm('确定屏蔽回答？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.idx = index;
                    this.form = row;
                    console.log('单条同意',index,row)
                    let data = {
                        token: window.sessionStorage.getItem('token'),
                        qr_id:row.qr_id
                    }
                    let _this=this
                    console.log(data)
                    this.$axios({
                        method: "post",
                        url: 'administrator/agreereportreply',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        console.log("单条同意",res);
                        if(res.data.resultCode==20034){
                            _this.getData()
                            _this.$message.success('操作成功')
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
                ids += this.agreeList[i].qr_id + ',';
            }
            // console.log('单条同意',index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                qr_id:ids
            }
            let _this=this
            // console.log(data)
            this.$confirm('确定屏蔽回答？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: "post",
                        url: 'administrator/agreereportreply',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        console.log("单条同意",res);
                        if(res.data.resultCode==20034){
                            _this.getData()
                            _this.$message.success('操作成功')
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
.qContent{
    height: 70px;
    /* white-space:nowrap; 规定段落中的文本不进行换行 */
    text-overflow:ellipsis; /*text-overflow 属性规定当文本溢出包含元素时发生的事情。ellipsis:显示省略符号来代表被修剪的文本。*/
    overflow:hidden;
    vertical-align:middle;
    display: flex;
    /* align-items: center; */
}
.checkAction{
    display: flex;
    justify-content: space-around;
}
</style>
