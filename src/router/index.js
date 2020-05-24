import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/checkUserRegister',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/checkUserRegister.vue'),
                    meta: { title: '审核新注册用户' }
                },
                {
                    path: '/viewUserList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/viewUserList.vue'),
                    meta: { title: '查看已注册用户列表' }
                },
                {
                    path: '/checkReportedUser',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/checkReportedUser.vue'),
                    meta: { title: '审核用户举报' }
                },
                {
                    path: '/checkAppealedUser',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/checkAppealedUser.vue'),
                    meta: { title: '审核用户申诉' }
                },
                {
                    path: '/checkReportedQuestion',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/checkReportedQuestion.vue'),
                    meta: { title: '审核被举报问题' }
                },
                {
                    path: '/viewReportedQueslist',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/viewReportedQueslist.vue'),
                    meta: { title: '查看已处理被举报问题列表' }
                },
                {
                    path: '/checkAppealedQuestion',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/checkAppealedQuestion.vue'),
                    meta: { title: '审核问题申诉' }
                },
                {
                    path: '/checkReportedAnswer',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/checkReportedAnswer.vue'),
                    meta: { title: '审核被举报回答' }
                },
                {
                    path: '/viewReportedAnswer',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/viewReportedAnswer.vue'),
                    meta: { title: '查看已处理被举报回答列表' }
                },
                {
                    path: '/checkAppealedAnswer',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/checkAppealedAnswer.vue'),
                    meta: { title: '审核回答申诉' }
                },
                {
                    path: '/log',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/log.vue'),
                    meta: { title: '管理员日志' }
                },
                {
                    path: '/setting',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/setting.vue'),
                    meta: { title: '设置' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },

        // 超管
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../superAdmin/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/superAdmin/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../superAdmin/page/Dashboard.vue'),
                    meta: { title: '超管系统首页' }
                },
                {
                    path: '/superAdmin/dataDisplay',
                    component: () => import(/* webpackChunkName: "table" */ '../superAdmin/page/dataDisplay.vue'),
                    meta: { title: '数据展示' }
                },
                {
                    path: '/superAdmin/adminList',
                    component: () => import(/* webpackChunkName: "table" */ '../superAdmin/page/adminList.vue'),
                    meta: { title: '普通管理员列表' }
                },
                {
                    path: '/superAdmin/adminWork',
                    component: () => import(/* webpackChunkName: "table" */ '../superAdmin/page/adminWork.vue'),
                    meta: { title: '查看管理员工作' }
                },
                {
                    path: '/superAdmin/log',
                    component: () => import(/* webpackChunkName: "editor" */ '../superAdmin/page/log.vue'),
                    meta: { title: '管理员日志' }
                },
                {
                    path: '/superAdmin/setting',
                    component: () => import(/* webpackChunkName: "editor" */ '../superAdmin/page/setting.vue'),
                    meta: { title: '设置' }
                },
            ]
        },
    ]
});
