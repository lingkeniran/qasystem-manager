<template>
    <div>
        <el-row :gutter="20">
            <el-card shadow="hover" class="mgb20" style="height:225px;">
                <div class="user-info">
                    <img :src="portrait" class="user-avator" alt />
                    <div class="user-info-cont">
                        <div class="user-info-name">{{username}}</div>
                        <div>超级管理员</div>
                    </div>
                    <div class="welcome">
                        欢迎来到管理员后台
                    </div>
                </div>
            </el-card>
        </el-row>
        <el-row :gutter="20">
            <el-card shadow="hover" class="mgb20" style="height:360px;">
                <div id="pieChart" class="pieChart-container"></div>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
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
    mounted(){
        this.pieChart()
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
        pieChart(){
            var myChart = this.$echarts.init(document.getElementById('pieChart'));
            let data = {
                token: window.sessionStorage.getItem('token'),
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getanumber',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("折线图",res);
                if(res.data.resultCode==20006){
                    var superAdmin=res.data.data.超级管理员数量
                    var Admin=res.data.data.普通管理员数量
                    var option={
                        title:{
                            text:'管理员组成'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                            orient: 'vertical',
                            top: 'middle',
                            bottom: 10,
                            left: 'right',
                            data: [ '普通管理员', '超级管理员']
                        },
                        series: [
                        {
                            name:'管理员组成',
                            type: 'pie',
                            radius: '65%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            data:[
                                {value: superAdmin, name: '超级管理员'},
                                {value: Admin, name: '普通管理员'}],
                            itemStyle:{  
                                normal:{  
                                    color:function(params) {
                                    //自定义颜色
                                        var colorList = [          
                                                '#67E0E3', '#9FE6B8', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                                            ];
                                            return colorList[params.dataIndex]
                                        }
                                }  
                            }
                        }],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                    myChart.setOption(option);
                }else if(res.data.resultCode==20007){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请重新尝试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }
};
</script>


<style scoped>
.welcome{
    margin-right: 420px;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 24px;
}

.pieChart-container{
    height: 360px;
    width: 800px;
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
</style>
