<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理员列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="handle-box-1">
                    <el-input v-model="a_id" placeholder="管理员id" class="handle-input mr10"></el-input>
                    <el-input v-model="a_name" placeholder="管理员名字" class="handle-input mr10"></el-input>
                    <el-input v-model="a_phone" placeholder="管理员手机号" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
                </div>
                <div class="handle-box-2">
                    <el-button class="plusAdmin" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisible = true">添加管理员信息</el-button>
                    <el-dialog
                        title="添加管理员"
                        :visible.sync="dialogVisible"
                        width="50%"
                        center
                        @close='closeDialog'
                        :close-on-click-modal='false'>
                        <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                            <el-form-item label="管理员名字" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员类型" prop="type">
                                <el-select v-model="ruleForm.type" placeholder="请选择管理员类型">
                                    <el-option label="普通管理员" value="1"></el-option>
                                    <el-option label="超级管理员" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="管理员手机号" prop="phone">
                                <el-input v-model="ruleForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="管理员头像" prop="cropImg">
                                <div class="crop-demo">
                                    <img :src="cropImg" class="pre-img">
                                    <div class="crop-demo-btn">上传头像
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                                    </div>
                                </div>
                            
                                <el-dialog title="裁剪图片" :visible.sync="picDialogVisible" width="30%" append-to-body>
                                    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="cancelCrop">取 消</el-button>
                                        <el-button type="primary" @click="picDialogVisible = false">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-button type="primary" icon="el-icon-unlock" @click="resetPassSelection()">批量重置密码</el-button>
                    <el-dropdown>
                        <el-button class="viewMessage" type="primary">
                            分类查看<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><div @click="getData()">全部管理员</div></el-dropdown-item>
                            <el-dropdown-item><div @click="getAdmin()">普通管理员</div></el-dropdown-item>
                            <el-dropdown-item><div @click="getSuperAdmin()">超级管理员</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
                <el-table-column prop="a_id" label="管理员id" width="90"></el-table-column>
                <el-table-column prop="a_name" label="管理员名字" width="200"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.a_icon"
                            :preview-src-list="[scope.row.a_icon]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="a_phone" label="管理员手机号"></el-table-column>
                <el-table-column  label="身份" width="200" align="center">
                    <slot slot-scope="scope">
                        <el-tag v-if="scope.row.a_type===0">超级管理员</el-tag>
                        <el-tag type="success" v-else>普通管理员</el-tag>
                    </slot>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div class="checkAction">
                            <el-button
                                type="text"
                                icon="el-icon-unlock"
                                @click="resetPass(scope.$index, scope.row)"
                            >重置密码</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="page"
                    :page-size='10'
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import 'cropperjs/dist/cropper.css';
import VueCropper  from 'vue-cropperjs';
export default {
    components:{
        VueCropper
    },
    data() {
        var checkphone = (rule, value, callback) => {
            // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
            if (value == "") {
                callback(new Error("请输入手机号"));
            } else if (!this.isCellPhone(value)) {//引入methods中封装的检查手机格式的方法
                callback(new Error("请输入正确的手机号!"));
            } else {
                callback();
            }
        };
        return {
            labelPosition:'left',
            imageUrl: '',
            imgSrc:'',
            cropImg: ' data:image/png;base64,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',
            picDialogVisible: false,
            // defaultSrc: require('../assets/portrait.jpg'),
            defaultSrc:' data:image/png;base64,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',
            ruleForm: {
                name: '',
                type: '',
                phone: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入管理员名字', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择管理员类型', trigger: 'change' }
                ],
                phone: [
                    { type: 'date', validator: checkphone, required: true, trigger: 'change' }
                ]},
            newAdminName:'',
            page:1,
            dialogVisible:false,
            tableData: [],
            multipleSelection: [],
            resetPassList: [],
            editVisible: false,
            pageTotal: 0,
            startTime:'',
            endTime:'',
            agreeList:[],
            disagreeList:[],
            a_name:'',
            a_phone:'',
            a_id:'',
            a_type:'',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getAdmin(){
            this.a_type=1
            this.getData()
        },
        getSuperAdmin(){
            this.a_type=0
            this.getData()
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        resetPass(index, row) {
            this.$confirm('确定重置管理员密码？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.idx = index;
                    this.form = row;
                    console.log('单条重置',index,row)
                    let data = {
                        token: window.sessionStorage.getItem('token'),
                        a_id:row.a_id
                    }
                    let _this=this
                    console.log(data)
                    this.$axios({
                        method: "post",
                        url: 'administrator/resetpass',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        console.log("单条同意",res);
                        if(res.data.resultCode==20034){
                            // _this.getData()
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
        resetPassSelection(){
            const length = this.multipleSelection.length;
            let ids = '';
            this.resetPassList = this.multipleSelection;
            // console.log('同意列表',this.agreeList)
            for (let i = 0; i < length; i++) {
                ids += this.resetPassList[i].a_id + ',';
            }
            // console.log('单条同意',index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                a_id:ids
            }
            let _this=this
            // console.log(data)
            this.$confirm('确定重置管理员密码？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: "post",
                        url: 'administrator/resetpass',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        console.log("批量重置",res);
                        if(res.data.resultCode==20034){
                            // _this.getData()
                            _this.$message.success('操作成功')
                            // location.reload()
                        }
                        else if(res.data.resultCode==20035){
                            _this.$message.error('操作失败')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                })
                .catch(() => {});
        },
        //检查手机号
        isCellPhone(val) {
            if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
                return false;
            } else {
                return true;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                // alert('submit!');
                let data = {
                    token: window.sessionStorage.getItem('token'),
                    a_type:this.ruleForm.type,
                    a_phone:this.ruleForm.phone,
                    a_name:this.ruleForm.name,
                    a_icon:this.cropImg,
                }
                let _this=this
                this.$axios({
                    method: "post",
                    url: 'administrator/addadministrator',
                    data: this.$Qs.stringify(data)
                })
                .then(function(res) {
                    console.log("添加管理员",res);
                    if(res.data.resultCode==1002||res.data.resultCode==1003||res.data.resultCode==1004){
                        _this.$message({
                            message: '登录失效，请重新登录',
                            type: 'warning'
                        });
                    }else if(res.data.resultCode==20037){
                        _this.$message.success('添加管理员成功')
                        _this.dialogVisible=false
                        _this.getData()
                    }else if(res.data.resultCode==20038){
                        _this.$message.error('添加管理员失败')
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
            } else {
                this.$message.error('添加管理员错误，请重新填写');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        closeDialog(){
            this.ruleForm.name=""
            this.ruleForm.type=""
            this.ruleForm.phone=""
        },
        setImage(e){
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.picDialogVisible = true;
                this.imgSrc = event.target.result;
                console.log('imgSrc',this.imgSrc)
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                // console.log(event.target.result)
            };
            reader.readAsDataURL(file);
        },
        cropImage () {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            console.log('cropImg',this.cropImg)
        },
        cancelCrop(){
            this.picDialogVisible = false;
            this.cropImg = this.defaultSrc;
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
                a_type:this.a_type,
                a_phone:this.a_phone,
                a_name:this.a_name,
                a_id:this.a_id,
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getalist',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("管理员列表",res);
                if(res.data.resultCode==1002||res.data.resultCode==1003||res.data.resultCode==1004){
                    _this.$message({
                        message: '登录失效，请重新登录',
                        type: 'warning'
                    });
                }
                _this.tableData=res.data.data.list
                // console.log(_this.tableData)
                _this.pageTotal=res.data.data.totalRow
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
    margin-bottom: 10px;
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
.addAdmin{
    display: flex;
}
 /* 上传头像 */
.content-title{
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.pre-img{   
    margin-right: 10px;
    width: 80px;
    height: 80px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
}
.crop-demo{
    /* width: 80px; */
    display: flex;
    justify-content: flex-start;
    /* align-items: flex-end; */
    flex-wrap: nowrap;
    align-items: center;
}
.crop-demo-btn{
    position: relative;
    width: 80px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    /* margin: 5px auto; */
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.modify-input{
    margin-top: 5px;
    display: flex;
}
.submit{
    margin-left: 10px;
    height: 40px;
}
.plusAdmin{
    margin-right: 10px;
}
.viewMessage{
    margin-left: 10px;
}
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
