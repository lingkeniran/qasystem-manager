<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover" class="mgb20" style="height:225px;">
                    <div class="user-info">
                        <img :src="portrait" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{username}}</div>
                            <div>普通管理员</div>
                        </div>
                        <div class="welcome">
                            欢迎来到管理员后台
                        </div>
                    </div> 
                </el-card>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-card shadow="hover" style="height:300px;">
                            <div slot="header" class="clearfix">
                                <span>待办事项</span>
                                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
                            </div>
                            <div class="item" v-for="item in todoList" :key="item">{{item}}</div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" style="height:300px;">
                            <div slot="header" class="clearfix">
                                <span>已处理事项</span>
                                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
                            </div>
                            <div class="item" v-for="item in doneList" :key="item">{{item}}</div>
                        </el-card>
                    </el-col>
                    
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row :gutter="20" class="mgb22">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userAmount}}</div>
                                    <div>用户总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-question grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{quesAmount}}</div>
                                    <div>问题总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-comment grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{answerAmount}}</div>
                                    <div>回答总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" class="chart-wrapper">
                    <div id="barChart" class="echart"></div>
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
// import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            userAmount:'',
            quesAmount:'',
            answerAmount:'',
            portrait:'',
            username:'',
            oldpass:'',
            newpass:'',
            newpass2:'',
            name: localStorage.getItem('ms_username'),
            todoList: [],
            doneList:[],
        };
    },
    computed: {
        // role() {
        //     return this.name === 'admin' ? '超级管理员' : '普通用户';
        // }
    },
    mounted(){
        this.barChart()
    },
    created() {
        // this.handleListener();
        // this.changeDate();
        this.getUserInfo()
        this.getAmountNumber()
        this.getTodoList()
        this.getdoneList()
    },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        getdoneList(){
            let data = {
                token: window.sessionStorage.getItem('token')
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/dealedItem',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("doneList",res);
                // console.log(res.data.data.u_icon)
                if(res.data.resultCode==20006){
                    _this.doneList=res.data.data
                    // console.log(_this.doneList)
                }else if(res.data.resultCode==20007){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请稍后再试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        getTodoList(){
            let data = {
                token: window.sessionStorage.getItem('token')
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/dealItem',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("todolist",res);
                // console.log(res.data.data.u_icon)
                if(res.data.resultCode==20006){
                    _this.todoList=res.data.data
                    // console.log(_this.todoList)
                }else if(res.data.resultCode==20007){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请稍后再试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        getAmountNumber(){
            let data = {
                token: window.sessionStorage.getItem('token')
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getnumber',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("数字Amount",res);
                // console.log(res.data.data.u_icon)
                if(res.data.resultCode==20006){
                    _this.userAmount=res.data.data.用户总量
                    _this.quesAmount=res.data.data.问题总量
                    _this.answerAmount=res.data.data.回答总量
                }else if(res.data.resultCode==20007){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请稍后再试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
        async barChart(){
		  // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('barChart'));
            const {data:res} =await this.$axios.get('administrator/dealednumber',{params:{'token':window.sessionStorage.getItem('token')}})
            console.log('柱状图',res)
            var value=res.data
            console.log(value)
            var option = {
                title: {
                    text: '当日已完成事项'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['新注册用户', '被举报用户', '用户申诉', '被举报问题', '问题申诉', '被举报回答', '回答申诉'],
                    axisLabel: {interval:0,rotate:-35 }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: value,
                    type: 'bar',
                    //颜色  
                    itemStyle:{  
                        normal:{  
                        color:'#229ad1',  
                        }  
                    }
                }]
            };
            myChart.setOption(option);
        },
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
                    // console.log(_this.portrait)
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
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.chart-wrapper{
    height: 404px;
    padding: 0;
}

.welcome{
    /* margin-right: 420px; */
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 24px;
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
    width: 80px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(255, 131, 131);
}

.grid-con-1 .grid-num {
    color: rgb(255, 131, 131);
}

.grid-con-2 .grid-con-icon {
    background: rgb(246, 255, 122);
}

.grid-con-2 .grid-num {
    color: rgb(246, 255, 122);
}

.grid-con-3 .grid-con-icon {
    background: rgb(67, 207, 242);
}

.grid-con-3 .grid-num {
    color: rgb(67, 207, 242);
}

.user-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
    width: auto;
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
}
.mgb22{
    margin-bottom: 20px;
    margin-top: 20px;
}
.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.echart {
    width: 600px;
    height: 400px;
}
.item{
    font-size: 16px;
    line-height: 26px;
}
</style>
