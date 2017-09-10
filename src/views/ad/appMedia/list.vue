<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索区域 -->
        <div class="filter-container">
            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.appId_eq" placeholder="应用">
                <el-option v-for="item in appIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.search.mediaId_eq" placeholder="媒体">
                <el-option v-for="item in mediaIdOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>

        </div>


        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <!--<el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>-->
            <el-button class="filter-item" type="primary" icon="plus" @click="handleCreate">添加</el-button>
        </div>

        <!-- 列表 -->
        <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="ID" width="80">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="应用名称" width="200">
                <template scope="scope">
                    <span>{{scope.row.appName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="媒体名称" width="100">
                <template scope="scope">
                    <span>{{scope.row.mediaName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="推广地址" width="200">
                <template scope="scope">
                    <span>{{scope.row.url}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="扣量初始值" width="130">
                <template scope="scope">
                    <span>{{scope.row.startCount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="回调率" width="100">
                <template scope="scope">
                    <span>{{scope.row.discountRate}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="秘钥" width="100">
                <template scope="scope">
                    <span>{{scope.row.appKey}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间" width="160">
                <template scope="scope">
                    <span>{{scope.row.createTime | timeFilter('{y}-{m}-{d} {h}:{i}')}} </span>
                </template>
            </el-table-column>

            <el-table-column  align="center" label="操作" width="100">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
                    </el-button>
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
                <el-form-item label="应用名称">
                    <el-select clearable class="filter-item" style="width: 130px" v-model="temp.appId" :disabled=" dialogStatus=='update'">
                        <el-option v-for="item in appIdOptionsWithoutAll" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="媒体名称">
                    <el-select clearable class="filter-item" style="width: 130px" v-model="temp.mediaId" :disabled=" dialogStatus=='update'">
                        <el-option v-for="item in mediaIdOptionsWithoutAll" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="扣量初始值">
                    <el-input v-model="temp.startCount"></el-input>
                </el-form-item>

                <el-form-item label="回调率">
                    <el-input v-model="temp.discountRate"></el-input>
                </el-form-item>

                <el-form-item label="秘钥">
                    <el-input v-model="temp.appKey"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    /* eslint-disable no-unused-vars,indent,linebreak-style,prefer-const,padded-blocks,no-empty-function,linebreak-style,brace-style,no-trailing-spaces,dot-notation */

    import { parseTime, objectMerge } from 'utils';
    import store from 'store';

    import { getUidWithUndefined, isAdminRole } from 'src/utils/permission.js'

    import { Message } from 'element-ui';
    import { appListNoPage } from 'api/ad/app'
    import { mediaListNoPage } from 'api/ad/media'
    import { appMediaList, appMediaCreate, appMediaUpdate } from 'api/ad/appMedia'


    export default {
        name: 'table_demo',
        data() {
            return {
                userName: store.getters.name,
                isAdminRole: isAdminRole(),
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    search: {
                        appId_eq: undefined,
                        mediaId_eq: undefined
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
                    appId: undefined,
                    mediaId: undefined
                },
                appIdOptions: [],
                appIdOptionsWithoutAll: [],
                mediaIdOptions: [],
                mediaIdOptionsWithoutAll: []
            }
        },
        created() {
            this.getAppList();
            this.getMediaList();
            this.getList();
        },
        filters: {
            timeFilter(time) {
                if (time === 0) {
                    return 0
                }
                else {
                    return parseTime(time, '{y}-{m}-{d} {h}:{i}')
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

                appMediaList(search, page, size).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total
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
                this.temp = Object.assign({}, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            update() {
                console.log(this.temp);
                appMediaUpdate(this.temp).then(response => {
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
                    appId: undefined,
                    mediaId: undefined
                }
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            create() {
                appMediaCreate(this.temp).then(response => {
                    if (response.data > 0) {
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

            // 导出excel
            handleDownload() {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('vendor/Export2Excel');
                    const tHeader = ['应用ID', '商户名称', '应用名称', '回调地址', '返回地址', '秘钥', '创建时间'];
                    const filterVal = [
                        { name: 'id' },
                        { name: 'userName' },
                        { name: 'appName' },
                        { name: 'callbackUrl' },
                        { name: 'nodifyUrl' },
                        { name: 'secretkey' },
                        { name: 'createTime', filterFunction: parseTime }
                    ];
                    const data = this.formatJson(filterVal, this.list);
                    export_json_to_excel(tHeader, data, '应用数据');
                })
            },
            formatJson(filterVal, jsonData) {
                let data = jsonData.map(v => filterVal.map(j => {
                    if (j['filterOptionsObj'] !== undefined) {
                        return j['filterOptionsObj'][v[j['name']]]
                    } else if (j['filterFunction'] !== undefined) {
                        let func = eval(j['filterFunction'])
                        return func(v[j['name']])
                    } else {
                        return v[j['name']]
                    }
                }));
                return data;
            }
        }
    }
</script>
