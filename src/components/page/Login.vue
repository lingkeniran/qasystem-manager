<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">Q&A问答系统管理平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="param.account" placeholder="account">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>

export default {
    data: function() {
        return {
            param: {
                account: '',
                password: '',
            },
            rules: {
                account: [{ required: true, message: '请输入工号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                console.log(valid)
                let data = this.param
                let _this=this
                if (valid) {
                    this.$axios({
                        method: "post",
                        url: 'public/login',
                        data: this.$Qs.stringify(data)
                    })
                    .then(function(res) {
                        console.log('登录',res);
                        if(res.data.resultCode==10000){
                            window.sessionStorage.setItem('token',res.data.data.token)
                            if(res.data.data.u_id==1){
                                // 普通管理员
                                _this.$router.push('/dashboard')
                            }else if(res.data.data.u_id==0){
                                // 超级管理员
                                _this.$router.push('/superAdmin/dashboard')
                            }
                            // console.log(res.data.data);
                            // window.sessionStorage.setItem('m_id',res.data.data.u_id)
                            _this.$message.success('登录成功');
                        }else if(res.data.resultCode==10001){
                            _this.$message.error('登录失败_账号或密码错误')
                        }else if(res.data.resultCode==10002){
                            _this.$message.error('登录失败_用户不存在')
                        }else if(res.data.resultCode==10003){
                            _this.$message.error('登录失败_账号或密码为空')
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                    // this.$router.push('/');
                } else {
                    _this.$message.error('请输入账号和密码');
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: black;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>