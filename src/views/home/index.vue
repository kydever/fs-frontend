<template>
  <div>
    <el-row class="bread">
      <el-col :span="18">
        <p>{{ path }}</p>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" class="butri male" @click="addFile(false)">新增文件夹</el-button>
        <el-button type="primary" class="butri" @click="addFile(true)">新增文件</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="treebg" :span="8">
        <el-tree
          :data="treeList"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="keys"
          accordion
          @node-click="handleNodeClick"
        >
          <template #default="scope">
            <div class="custom-node">
              <el-icon v-if="scope.node.data.is_dir"><Folder /></el-icon>
              <span class="lable_sp">{{ scope.node.label }}</span>
            </div>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="16" class="table_div">
        <el-button class="ma_bo" type="primary" @click="allDownloadFun">批量下载</el-button>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title" label="文件名" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" @click="reviseFun(scope.row)">修改</el-button>
              <el-button type="primary" @click="downloadFun(scope.row)">下载</el-button>
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

const defaultProps = {
  children: 'children',
  label: 'title',
  isdir:'is_dir'
}

const dialog = reactive({
  path:'/',
  isfile: true,
  data: {}
})

interface Tree {
  id: number
  path: string
  title: string
  'is_dir': boolean
  children?: Tree[]
}

const treeList = ref(<any>[])

const keys = ref([])

const tableData = ref([])

const allid = ref([])

const path = ref('/')

const arrangementData = (parems,list)=>{
  if(parems.dirname === '/'){
    let newList = [list[0]]
    newList[0].children = list.slice(1,list.length)
    newList[0].children.map((item)=>keys.value.push(item.id))
    treeList.value = newList
    console.log(treeList)
  }else{
    const recursionData = (dataList, path) => {
      for (const i in dataList) {
        let item = dataList[i]
        if(item.is_dir && item.path === path){
          item.children = list
        } else {
          if(item.children){
            recursionData(item.children,path)
          }
        }
      }
    }
    recursionData(treeList.value[0].children,parems.dirname)
    tableData.value = list.filter((item)=>!item.is_dir)
  }
}


const getfileList = async(parems)=>{
  try {
    const { list } = await getFile(parems)
    arrangementData(parems, list)
  } catch (error) {
    console.log(error)
  }
}

const addFile = (parems) => {
  dialog.isfile = parems
  visible.value = true
}

const closeFun = ()=>{
  visible.value = false
  getfileList({ dirname:'/' })
}

const handleNodeClick = ( data: Tree )=> {
  dialog.path = data.path
  path.value = data.path
  if( data.is_dir ){
    getfileList({ dirname: data.path })
  }
}

const downloadfile = async(parems) => {
  try {
    const body = {
      ids: parems
    }
    const { list } = await postFileDownloadUrl(body)
    list.map((item)=>{
      if(item.url){
        download(item.url,'')
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const downloadFun = (parems)=>{
  downloadfile([parems.id])
}

const handleSelectionChange = (val) => {
  allid.value = []
  allid.value = val.map((item)=>{return item.id})
}

const allDownloadFun = () => {
  downloadfile(allid.value)
}

const reviseFun = (parems)=>{
  console.log(parems)
  dialog.data = parems
  addFile(true)
}

getfileList({ dirname:'/' })

</script>

<style scoped lang="scss">
.bread{
  padding-bottom: 20px;
}
.treebg{
  background-color: #fff;
}
.butri{
  float: right;
}
.male{
  margin-left: 8px;
}
.lable_sp{
  padding-left: 8px;
}
.table_div{
  padding-left: 10px;
}
.ma_bo{
  margin-bottom: 20px;
}
</style>
