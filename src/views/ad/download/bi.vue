<template>
    <div class="dashboard-editor-container">
        <a href="https://das.base.shuju.aliyun.com/token3rd/shulaibao/preview.htm?pageId=35ee29eb-1833-4ba2-ae52-825eebbe66a5&accessToken=0268c3e55f86c8ede02e0a73d51023ac#dda4db35-025c-47dd-b746-b3a4c2ad120d*=*{'currentInx':0}" target="_blank" >
            <h2 style="text-decoration: underline">点击跳转到下载报表</h2>
        </a>
        <a href="https://das.base.shuju.aliyun.com/token3rd/shulaibao/preview.htm?pageId=35ee29eb-1833-4ba2-ae52-825eebbe66a5&accessToken=0268c3e55f86c8ede02e0a73d51023ac#dda4db35-025c-47dd-b746-b3a4c2ad120d*=*{'currentInx':0}" target="_blank" v-if="isAdmin">
            <h2 style="text-decoration: underline">点击跳转到下载报表2</h2>
        </a>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import PanThumb from 'components/PanThumb';
    import countTo from 'vue-count-to';
    import { getPayData } from 'api/login'
    import store from 'store';
    import { isAdminRole } from 'utils/permission'

    export default {
        name: 'dashboard-default',
        data() {
            return {
                isAdmin: isAdminRole()
            }
        },
        methods: {
        },
        created() {
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .emptyGif {
        display: block;
        width: 45%;
        margin: 0 auto;
    }
    .dashboard-editor-container {
        background-color: #e3e3e3;
        min-height: 100vh;
        margin-top: -50px;
        padding: 100px 60px 0px;
        .pan-info-roles {
            font-size: 12px;
            font-weight: 700;
            color: #333;
            display: block;
        }
        .info-container {
            position: relative;
            margin-left: 190px;
            height: 150px;
            line-height: 200px;
            .display_name {
                font-size: 48px;
                line-height: 48px;
                color: #212121;
                position: absolute;
                top: 25px;
            }
        }
    }

</style>
