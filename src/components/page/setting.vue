<template>
    <el-col :span="8">
        <el-card shadow="hover" class="mgb20" >
            <div class="user-info">
                <img :src="portrait" class="user-avator" alt />
                <div class="user-info-cont">
                    <div class="user-info-name">{{username}}</div>
                    <div>普通管理员</div>
                </div>
            </div>
            <div class="changePass-wrapper">
                <div class="changeText">修改密码</div>
                <div class="changePass">
                    原密码：
                    <el-input class="changePass-input" v-model="oldpass" show-password placeholder="请输入原密码"></el-input>
                </div>
                <div class="changePass">
                    新密码：
                    <el-input class="changePass-input" v-model="newpass" show-password placeholder="请输入新密码"></el-input>
                </div>
                <div class="changePass">
                    再次输入：
                    <el-input class="changePass-input" v-model="newpass2" show-password placeholder="请再次输入"></el-input>
                </div>
                <el-button @click="changePass()" class="changePass-button" type="primary">修改密码</el-button>
            </div>
        </el-card>
    </el-col>
</template>

<script>
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            portrait:'',
            username:'',
            oldpass:'',
            newpass:'',
            newpass2:'',
        };
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        getUserInfo(){
            let data = {
                token: window.sessionStorage.getItem('token')
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getInfo',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("管理员信息",res);
                // console.log(res.data.data.u_icon)
                if(res.data.resultCode==20006){
                    _this.portrait=res.data.data.a_icon
                    console.log(_this.portrait)
                    _this.username=res.data.data.a_name
                }else if(res.data.resultCode==20007){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请稍后再试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        changePass(){
            let data = {
                token: window.sessionStorage.getItem('token'),
                oldpass:this.oldpass,
                newpass:this.newpass
            }
            let _this=this
            if(_this.newpass!=_this.newpass2){
                _this.$message.error('两次输入不一致，请重新输入')
                return
            }else{
                this.$axios({
                    method: "post",
                    url: 'administrator/changePass',
                    data: this.$Qs.stringify(data)
                })
                .then(function(res) {
                    console.log("修改密码",res);
                    // console.log(res.data.data.u_icon)
                    if(res.data.resultCode==1002||res.data.resultCode==1003||res.data.resultCode==1004){
                        _this.$message({
                            message: '登录失效，请重新登录',
                            type: 'warning'
                        });
                    }
                    if(res.data.resultCode==20034){
                        _this.$message.success('修改密码成功')
                    }else if(res.data.resultCode==20036){
                        // console.log(res.resultCode)
                        _this.$message.error('原密码错误')
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        }
    }
};
</script>


<style scoped>
.changeText{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}
.changePass-button{
    margin-top: 5px;
}
.changePass{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    /* width: 300px; */
}
.changePass-input{
    width: 180px;
}
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
    margin-right: 20px;
    width: 100%;
    height: 100%;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}

.el-col-8{
    width: 100%;
    height: 100%;
}
.welcome-text{
    margin-top: 30px;
    font-size: 28px;
    font-weight: bold;
    display: flex;
    justify-content: center;
}
</style>
