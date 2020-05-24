<template>
    <div>
        <el-button
            type="text"
            icon="el-icon-close"
            class="red"
            @click="centerDialogVisible=true"
        >不屏蔽</el-button>
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
                v-model="reason">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false;handleDisagree();">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:['q_id'],
    data(){
        return{
            centerDialogVisible:false,
            visible: false,
            reason:'',
        }
    },
    methods:{
        closeDialog(){
            this.reason=''
        },
        handleDisagree() {
            // console.log('单条同意',index,row)
            let data = {
                token: window.sessionStorage.getItem('token'),
                qr_id:this.q_id,
                qr_reason:this.reason
            }
            let _this=this
            // console.log(data)
            this.$axios({
                method: "post",
                url: 'administrator/disagreereportquestion',
                data: this.$Qs.stringify(data)
            })
            .then(function(res) {
                console.log("单条不同意",res);
                if(res.data.resultCode==20034){
                    // this.$parent.getData()
                    _this.$emit('getData')
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
        },
    }
}
</script>

<style lang="less" scoped>
.red {
    color: #ff0000;
}
</style>