<template>
    <div class="container">
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
        <div class="LineChart-container" id="LineChart"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            startTime:'',
            endTime:'',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate: (time) => { 
                    return time.getTime() > Date.now()
                }
            },
            datevalue: '',
        }
    },
    mounted(){
        this.LineChart()
    },
    methods:{
        searchTime(){
            var length=this.datevalue[1]-this.datevalue[0]
            console.log(this.datevalue[1])
            console.log(this.datevalue[0])
            var  aDate,  oDate1,  oDate2,  iDays  
            aDate   =  this.datevalue[1].split("-")  
            oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2])    //转换为12-18-2006格式  
            console.log(oDate1)
            aDate   =  this.datevalue[0].split("-")  
            oDate2 = new Date(aDate[0] , aDate[1] , aDate[2])  
            console.log(oDate2)
            iDays   =  parseInt(Math.abs(oDate1  -  oDate2 )  /  1000  /  60  /  60  /24) + 1   //把相差的毫秒数转换为天数  
            // return  iDays
            console.log(iDays)
            if(iDays!=7){
                this.$message.warning('查询时间长度必须为7天')
                return
            }else{
                this.startTime=this.datevalue[0]
                this.endTime=this.datevalue[1]
                this.LineChart()
            }
        },
        LineChart(){
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('LineChart'));
            let data = {
                token: window.sessionStorage.getItem('token'),
                starttime:this.startTime,
                endtime:this.endTime
            }
            let _this=this
            this.$axios({
                method: "post",
                url: 'administrator/getregisternumber',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("折线图",res);
                if(res.data.resultCode==20006){
                    var date=res.data.data.日期
                    var value=res.data.data.新注册人数
                    var question=res.data.data.问题
                    var answer=res.data.data.回复
                    var option = {
                        title: {
                            text: '数据展示'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['新注册用户','新问题数量','新回答数量']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                // magicType: {show: true, type: ['line', 'bar']},
                                // restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: date
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '新注册用户',
                                type: 'line',
                                stack: '总量',
                                data: value
                            },
                            {
                                name: '新问题数量',
                                type: 'line',
                                stack: '总量',
                                data: question
                            },
                            {
                                name: '新回答数量',
                                type: 'line',
                                stack: '总量',
                                data: answer
                            }
                        ]
                    };
                    myChart.setOption(option);
                }else if(res.data.resultCode==20036){
                    // console.log(res.resultCode)
                    _this.$message.error('加载失败，请重新尝试')
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        },
    }
}
</script>

<style lang="less" scoped>
.container{
    width: auto;
    height: auto; 
}
.block{
    margin-bottom: 15px;
}
.searchTime{
    margin-left: 10px;
}
.LineChart-container{
    width: 100%;
    height: 380px;
}
</style>