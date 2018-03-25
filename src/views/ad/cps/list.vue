<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索区域 -->
        <div class="filter-container">


            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.channelId_eq" placeholder="商户" v-if="isAdminRole">
                <el-option v-for="item in userIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-date-picker clearable class="filter-item" v-model="listTimeRange" type="datetimerange" :picker-options="pickerOptions2" placeholder="统计时间" align="right">
            </el-date-picker>
        </div>


        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="plus" @click="handleCreate">添加</el-button>
        </div>

        <!-- 列表 -->
        <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="统计时间" width="160">
                <template scope="scope">
                    <span>{{scope.row.statisticsDate | timeFilter('{y}-{m}-{d}')}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="渠道号" width="140">
                <template scope="scope">
                    <span>{{scope.row.channelId}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="渠道名称" width="140">
                <template scope="scope">
                    <span>{{scope.row.channelName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="游戏名称" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.appName"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.appName }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="点击量" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.clickAmount"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.clickAmount }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="新增激活量" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.activeIncrement"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.activeIncrement }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="新增注册量" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.registerIncrement"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.registerIncrement }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="当天充值金额" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.rechargeAmount"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.rechargeAmount }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="人数" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.peopleAmount"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.peopleAmount }}</span>
                </template>
            </el-table-column>

            <el-table-column  align="center" label="操作" width="140">
                <template scope="scope">
                    <!--<el-button v-show='!scope.row.edit && scope.row.id!=0 && isAdminRole' type="primary" @click='scope.row.edit=true' size="small" icon="edit">编辑</el-button>-->
                    <!--<el-button v-show='scope.row.edit' type="success" @click='handleUpdate(scope.row)' size="small" icon="check">完成</el-button>-->
                    <el-button type="success" @click='handleDelete(scope.row)' size="small" icon="check">删除</el-button>
                </template>

            </el-table-column>

        </el-table>

        <!-- 分页信息 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;' ref="tempForm">
                <el-form-item label="统计时间">
                    <el-date-picker v-model="temp.jsStatisticsDate" align="right" type="date" placeholder="选择统计时间" :picker-options="datePickerOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="渠道名称">
                    <el-select clearable class="filter-item" style="width: 130px" v-model="temp.channelId" :disabled="!isAdminRole || dialogStatus=='update'">
                        <el-option v-for="item in userIdOptionsWithoutAll" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="应用名称">
                    <el-input v-model="temp.appName"></el-input>
                </el-form-item>

                <el-form-item label="点击量">
                    <el-input v-model="temp.clickAmount"></el-input>
                </el-form-item>

                <el-form-item label="新增点击量">
                    <el-input v-model="temp.activeIncrement"></el-input>
                </el-form-item>

                <el-form-item label="新增注册量">
                    <el-input v-model="temp.registerIncrement"></el-input>
                </el-form-item>

                <el-form-item label="当天充值金额">
                    <el-input v-model="temp.rechargeAmount"></el-input>
                </el-form-item>

                <el-form-item label="人数">
                    <el-input v-model="temp.peopleAmount"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="deleteDialogVisible" class="deleteDialog" >
            <span>确定删除</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteData" >确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    /* eslint-disable no-unused-vars,indent,linebreak-style,prefer-const,padded-blocks,no-empty-function,linebreak-style,brace-style,no-trailing-spaces,dot-notation */

    import { parseTime, objectMerge } from 'utils';
    import store from 'store';

    import { Message } from 'element-ui';
    import { appList, appCreate, appUpdate } from 'api/financial/app_list'
    import { userListNoPage } from 'api/ad/user'
    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'

    import { dataList, dataCreate, dataDelete } from 'api/cps/channel_list'

    const datePickerOptions = {

            shortcuts: [{
                text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                }
                }, {
                    text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            }

    const pickerOptions2 = {
        shortcuts: [{
            text: '最近一天',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近三天',
            onClick(picker) {
                const end = new getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近7天',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setTime(getZeroTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '最近一个月',
            onClick(picker) {
                const end = getZeroTime();
                const start = getZeroTime();
                start.setDate(1)
                picker.$emit('pick', [start, end]);
            }
        }]
    }

    export default {
        name: 'table_demo',
        data() {
            return {
                totalDiffMoney: 0,
                userName: store.getters.name,
                isAdminRole: isAdminRole(),
                list: null,
                total: null,
                listLoading: true,
                listTimeRange: [],
                pickerOptions2,
                datePickerOptions,
                listQuery: {
                    page: 1,
                    limit: 10,
                    search: {
                        channelId_eq: undefined
                    }
                },
                tableKey: 0,
                dialogStatus: '',
                dialogFormVisible: false,
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                temp: {
                    userId: undefined,
                    jsStatisticsDate: undefined
                },
                userIdOptions: [],
                userIdOptionsWithoutAll: [],
                deleteDialogVisible : false,
                deleteRowId: undefined
            }
        },
        created() {
            this.getUserList()
            this.getList();
        },
        filters: {
            timeFilter(time, format) {
                if(time == undefined) {
                    return "---"
                }
                else if(time == 0) {
                    return 0
                }
                else {
                    return parseTime(time, format)
                }
            }

        },
        methods: {
            // 查询列表信息
            getList() {
                this.listLoading = true;

                let page = this.listQuery.page;
                let size = this.listQuery.limit;
                let search = this.listQuery.search;

                // 处理商户
                if ( typeof(this.listQuery.search.userId_eq) === 'undefined' && this.listQuery.search.userId_eq !== 0) {
                    this.listQuery.search.userId_eq = getUidWithUndefined()
                }

                // 处理时间
                search.statisticsDate_gte = Date.parse(this.listTimeRange[0])/1000;
                search.statisticsDate_lte = Date.parse(this.listTimeRange[1])/1000;


                dataList(search, page, size).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total
                    this.listLoading = false;
                })

            },
            getUserList() {
                userListNoPage().then(response => {
                    if (response.status === 200) {
                        this.userIdOptions.push({ key: null, display_name: '全部' })
                        response.data.list.forEach(u => {
                            this.userIdOptions.push({ key: u.id, display_name: u.name })
                            this.userIdOptionsWithoutAll.push({ key: u.id, display_name: u.name })
                        })

                    }
                })
            },
            // 点击搜索按钮事件
            handleFilter() {
                this.getList();
            },

            // 分页处理
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },

            // 编辑
            handleUpdate(row) {
                /*updatePayVerify(row).then(response => {
                    if (response.status == 200) {
                        Message({
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        });
                        row.edit = false;
                        this.getList()
                    } else {
                        Message({
                            message: '修改失败',
                            type: 'warning',
                            duration: 2000
                        });
                        row.edit = false;
                    }
                })*/

            },
            update() {
                console.log(this.temp);
                appUpdate(this.temp).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '修该成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogFormVisible = false;
                        this.getList()
                    } else {
                        Message({
                            message: '修改失败',
                            type: 'warning',
                            duration: 2000
                        });
                    }
                })

                this.dialogFormVisible = false;
            },

            // 添加
            handleCreate() {
                this.temp = {
                    jsStatisticsDate: undefined,
                    channelId: undefined
                }
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            create() {

                // 处理统计时间
                this.temp.statisticsDate = Date.parse(this.temp.jsStatisticsDate)/1000;

                dataCreate(this.temp).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogFormVisible = false;
                        this.getList()
                    } else {
                        Message({
                            message: '创建失败',
                            type: 'warning',
                            duration: 2000
                        });
                    }
                })
            },

            // 删除
            handleDelete(row) {
                this.deleteDialogVisible = true;
                this.deleteRowId = row.id
                console.log(row)
            },
            deleteData() {
                let dto = {id: this.deleteRowId}
                dataDelete(dto).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.deleteDialogVisible = false;
                        this.getList()
                    } else {
                        Message({
                            message: '删除失败',
                            type: 'warning',
                            duration: 2000
                        });
                        this.deleteDialogVisible = false;
                        this.getList()
                    }
                })
            }
        }
    }
</script>

<style>

</style>
