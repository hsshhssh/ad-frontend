<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索区域 -->
        <div class="filter-container">

            <el-date-picker clearable class="filter-item" v-model="jsPutTime" type="month" :picker-options="datePickerOptions" placeholder="投放月份" align="right">
            </el-date-picker>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.mediaId_eq" placeholder="媒体" filterable >
                <el-option v-for="item in mediaIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.leagueId_eq" placeholder="联盟" filterable >
                <el-option v-for="item in leagueIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.appId_eq" placeholder="应用" filterable >
                <el-option v-for="item in appIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-date-picker clearable class="filter-item" v-model="jsSettlementTime" type="month" :picker-options="datePickerOptions" placeholder="结算月份" align="right">
            </el-date-picker>
        </div>


        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="plus" v-if="isAdminRole" @click="handleCreate">添加</el-button>
        </div>

        <!-- 列表 -->
        <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="来源" width="140">
                <template scope="scope">
                    <span>{{scope.row.sourceName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="投放月份" width="160">
                <template scope="scope">
                    <span>{{scope.row.putTime | timeFilter('{y}-{m}')}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="媒体" width="140">
                <template scope="scope">
                    <span>{{scope.row.mediaName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="联盟名称" width="140">
                <template scope="scope">
                    <span>{{scope.row.leagueName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="应用名称" width="140">
                <template scope="scope">
                    <span>{{scope.row.appName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结算下游数" width="140">
                <template scope="scope">
                    <span>{{scope.row.callbackDownload}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="扣量下游数" width="140">
                <template scope="scope">
                    <span>{{scope.row.skipDownload}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结算月份" width="220">
                <template scope="scope">
                    <el-date-picker v-show="scope.row.edit" v-model="scope.row.jsSettlementTime" align="right" type="month" :picker-options="datePickerOptions">
                    </el-date-picker>
                    <span v-show="!scope.row.edit">{{scope.row.settlementTime | timeFilter('{y}-{m}')}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结算回调数" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.settlementCallback"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.settlementCallback }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结算扣量数" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.settlementSkip"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.settlementSkip }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="上游单价" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.upstreamPrice"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.upstreamPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="下游单价" width="140">
                <template scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.downstreamPrice"></el-input>
                    <span v-show="!scope.row.edit">{{ scope.row.downstreamPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="差价利润" width="140">
                <template scope="scope">
                    <span>{{scope.row.diffProfit}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="扣量利润" width="140">
                <template scope="scope">
                    <span>{{scope.row.skipProfit}} </span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="总利润" width="140">
                <template scope="scope">
                    <span>{{scope.row.totalProfit}} </span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="修改时间" width="200">
                <template scope="scope">
                    <span>{{scope.row.updateTime | timeFilter('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
                </template>
            </el-table-column>

            <el-table-column  align="center" label="操作" v-if="isAdminRole" width="220">
                <template scope="scope">
                    <el-button v-show='!scope.row.edit && scope.row.id!=0 && isAdminRole' type="primary" @click='handleUpdate(scope.row)' size="small" icon="edit">编辑</el-button>
                    <el-button v-show='scope.row.edit'type="success" @click='update(scope.row)' size="small" icon="check">完成</el-button>
                    <el-button v-show='scope.row.edit'type="warning" @click='cancelUpdate(scope.row)' size="small" icon="delete">取消</el-button>
                    <el-button type="warning" icon="delete" v-show="scope.row.id > 0 && scope.row.source == 2" @click='handleDelete(scope.row)' size="small">删除</el-button>
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
                    <el-date-picker v-model="temp.jsPutTime" align="right" type="month" placeholder="选择统计时间" :picker-options="datePickerOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="推广应用">
                    <el-select clearable class="filter-item" v-model="temp.adAppMediaId" filterable >
                        <el-option v-for="item in appMediaIdOptionsWithoutAll" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
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
    import { appListNoPage } from 'api/ad/app'
    import { mediaListNoPage } from 'api/ad/media'
    import { leagueListNoPage } from 'api/ad/league'
    import { appMediaListNoPage } from 'api/ad/appMedia'
    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'

    import { monthSettlementSearch, monthSettlementCreate, monthSettlementUpdate, monthSettlementDelete } from 'api/settlement/month_list'

    const datePickerOptions = {

    }

    const pickerOptions2 = {

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
                jsPutTime: undefined,
                jsSettlementTime: undefined,
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
                deleteRowId: undefined,
                appIdOptions: [],
                appIdOptionsWithoutAll: [],
                mediaIdOptions: [],
                mediaIdOptionsWithoutAll: [],
                leagueIdOptions: [],
                leagueIdOptionsWithoutAll: [],
                appMediaIdOptions: [],
                appMediaIdOptionsWithoutAll: [],
            }
        },
        created() {
            this.getMediaList();
            this.getAppList();
            this.getLeagueList();
            this.getAppMediaList();
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

                // 处理时间
                if (this.jsPutTime != '') {
                    search.putTime_eq = Date.parse(this.jsPutTime)/1000;
                } else {
                    search.putTime_eq = undefined;
                }

                if (this.jsSettlementTime != '') {
                    search.settlementTime_eq = Date.parse(this.jsSettlementTime/1000);
                } else {
                    search.settlementTime_eq = undefined;
                }


                monthSettlementSearch(search, page, size).then(response => {
                    var list = response.data.pageVO.list
                    var total = response.data.pageVO.total

                    var totalVO = response.data.totalVO;
                    list.push({id:0})
                    list.push({
                        id: 0,
                        sourceName: "汇总",
                        totalDownload: totalVO.totalDOw,
                        skipDownload: totalVO.skipDownload,
                        callbackDownload: totalVO.callbackDownload,
                        settlementSkip: totalVO.settlementSkip,
                        settlementCallback: totalVO.settlementCallback,
                        diffProfit: totalVO.diffProfit,
                        skipProfit: totalVO.skipProfit,
                        totalProfit: totalVO.totalProfit
                    });

                    list.forEach(function(element) {
                        element.edit = false;
                        element.jsSettlementTime = new Date(element.settlementTime)
                    });

                    this.list = list;
                    this.total = total;
                    this.listLoading = false;
                })

            },
            getAppList() {
                appListNoPage().then(response => {
                    if (response.status === 200) {
                        this.appIdOptions.push({ key: null, display_name: '全部' })
                        response.data.list.forEach(u => {
                            this.appIdOptions.push({ key: u.id, display_name: u.name })
                            this.appIdOptionsWithoutAll.push({ key: u.id, display_name: u.name })
                        })
                    }
                })
            },
            getMediaList() {
                mediaListNoPage().then(response => {
                    if (response.status === 200) {
                        this.mediaIdOptions.push({ key: null, display_name: '全部' })
                        response.data.list.forEach(u => {
                            this.mediaIdOptions.push({ key: u.id, display_name: u.name })
                            this.mediaIdOptionsWithoutAll.push({ key: u.id, display_name: u.name })
                        })
                    }
                })
            },
            getLeagueList() {
                leagueListNoPage().then(response => {
                    if (response.status === 200) {
                        this.leagueIdOptions.push({ key: null, display_name: '全部' })
                        response.data.list.forEach(u => {
                            this.leagueIdOptions.push({ key: u.id, display_name: u.name })
                            this.leagueIdOptionsWithoutAll.push({ key: u.id, display_name: u.name })
                        })
                    }
                })
            },
            getAppMediaList() {
                appMediaListNoPage().then(response => {
                    if (response.status === 200) {
                        this.appMediaIdOptions.push({ key: null, display_name: '全部' })
                        response.data.list.forEach(u => {
                            this.appMediaIdOptions.push({ key: u.id, display_name: u.name })
                            this.appMediaIdOptionsWithoutAll.push({ key: u.id, display_name: u.name })
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
                row.jsSettlementTime = new Date(row.settlementTime * 1000)
                row.edit = true;
            },
            cancelUpdate(row) {
                row.edit = false;
                this.getList();
            },
            update(row) {
                if (row.jsSettlementTime != undefined && row.jsSettlementTime != '') {
                    row.settlementTime = Date.parse(row.jsSettlementTime) / 1000
                }
                console.log(row)
                monthSettlementUpdate(row).then(response => {
                    if (response.data === 1) {
                        Message({
                            message: '修该成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getList()
                    } else {
                        Message({
                            message: '修改失败',
                            type: 'warning',
                            duration: 2000
                        });
                    }
                })
            },

            // 添加
            handleCreate() {
                this.temp = {
                    jsPutTime: undefined,
                    adAppMediaId: undefined
                }
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            create() {

                // 处理统计时间
                this.temp.putTime = Date.parse(this.temp.jsPutTime)/1000;

                monthSettlementCreate(this.temp).then(response => {
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
            },
            deleteData() {
                let dto = {id: this.deleteRowId}
                monthSettlementDelete(dto).then(response => {
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
