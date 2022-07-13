<template>
  <div>
    <el-row class="bread">
      <el-col :span="18">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item
            v-for="(item, index) in pathList"
            :key="index"
            :class=" index < pathList.length - 1 ? 'isfolder' : ''"
            @click="backnavFun(index)"
          >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          :disabled="butDisabled"
          class="butri male"
          @click="addFile(false)"
        >
          新增文件夹
        </el-button>
        <el-button type="primary" class="butri" @click="addNewFile">新增文件</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="table_div">
        <el-button class="ma_bo butri" type="primary" @click="allDownloadFun">批量下载</el-button>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="文件名">
            <template #default="scope">
              <span :class="scope.row.is_dir ? 'isfolder' : ''" @click="handleNodeClick(scope.row)"> {{ scope.row.title }} </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button v-if="!scope.row.is_dir" type="primary" @click="reviseFun(scope.row)">修改</el-button>
              <el-button v-if="!scope.row.is_dir" type="primary" @click="downloadFun(scope.row.id)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <dialogHome
        :data="dialog.data"
        :visible="visible"
        :path="dialog.path"
        :isfile="dialog.isfile"
        @closeFun="closeFun"
        @getnewList="getnewList"
      />
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref, reactive } from 'vue'
import dialogHome from './dialogHome.vue'
import { getFile, postFileDownloadUrl } from '@/api/home'
import { ArrowRight } from '@element-plus/icons-vue'
import { forEach, forIn } from 'lodash'
import { Folder } from '@element-plus/icons-vue'
import { download } from '@/utils/utils'

const visible = ref(false)

const dialog = reactive({
  path: '/',
  isfile: true,
  data: {}
})

interface Tree {
  id: number
  path: string
  title: string
  'is_dir': boolean
  summary?: string
  tags?: string[]
  children?: Tree[]
}

const allId = ref([])

const tableData = ref([])

const pathList = ref(<string[]>['根目录'])

const butDisabled = ref(false)

const getfileList = async (parems) => {
  try {
    const { list } = await getFile(parems)
    tableData.value = list
  } catch (error) {
    console.log(error)
  }
}

const addFile = (parems:boolean) => {
  dialog.isfile = parems
  visible.value = true
}

const closeFun = () => {
  dialog.data = {}
  dialog.path = '/'
  visible.value = false
}

const handleNodeClick = (data: Tree) => {
  if (data.is_dir) {
    getfileList({ dirname: data.path })
    dialog.path = data.path
    butDisabled.value = false
  } else {
    let i = data.path.lastIndexOf('/')
    dialog.path = data.path.substring(0, i)
    butDisabled.value = true
  }
  pathList.value.push(`${data.title}`)
  console.log(pathList)
}

const downloadfile = async (parems:number[]) => {
  try {
    const body = {
      ids: parems
    }
    const { list } = await postFileDownloadUrl(body)
    list.map((item) => {
      if (item.url) {
        download(item.url, '')
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const downloadFun = (parems:number) => {
  downloadfile([parems])
}

const handleSelectionChange = (val) => {
  allId.value = []
  allId.value = val.map((item) => {
    return item.id
  })
}

const allDownloadFun = () => {
  downloadfile(allId.value)
}

const reviseFun = (parems: Tree) => {
  dialog.data = parems
  addFile(true)
}

const addNewFile = () => {
  dialog.data = {}
  addFile(true)
}

const getnewList = (parems: string) => {
  getfileList({ dirname: parems })
}

const backnavFun = (num: number)=>{
  let path = ''
  if(num){
    pathList.value.slice(0,num+1).map((item)=>{
      if(item === '根目录'){
        path += ``
      }else{
        path += `/${item}`
      }
    })
  }else{
    path = '/'
  }
  pathList.value = pathList.value.slice(0, num+1)
  getfileList({ dirname: path })
}

getfileList({ dirname: '/' })

</script>

<style scoped lang="scss">
.bread {
  padding-bottom: 20px;
}

.treebg {
  background-color: #fff;
}

.butri {
  float: right;
}

.male {
  margin-left: 8px;
}

.lable_sp {
  padding-left: 8px;
}

.table_div {
  padding-left: 10px;
}

.ma_bo {
  margin-bottom: 20px;
}

.isfolder{
  cursor: pointer;
}

</style>
