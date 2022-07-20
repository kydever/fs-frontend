<template>
  <div>
    <el-row class="bread">
      <el-col :span="24">
        <el-button
          type="primary"
          class="butri male"
          @click="addFile(false)"
        >
          新增文件夹
        </el-button>
        <el-button type="primary" class="butri" @click="addNewFile">新增文件</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
      </el-col>
      <el-col :span="18" class="table_div">
        <el-button class="ma_bo butri male" type="primary" @click="allDownloadFun">批量下载</el-button>
        <el-button class="ma_bo butri" type="primary" @click="allDeleteFun">批量删除</el-button>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="文件名" prop="title" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button v-if="!scope.row.is_dir" type="primary" @click="reviseFun(scope.row)">修改</el-button>
              <el-button v-if="!scope.row.is_dir" type="primary" @click="downloadFun(scope.row.id)">下载</el-button>
              <el-button v-if="!scope.row.is_dir" type="primary" @click="deleteFun(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <dialogHome
        :ismodify="dialog.ismodify"
        :modify-data="dialog.modifyData"
        :visible="dialog.visible"
        :path="dialog.path"
        :isfile="dialog.isfile"
        @closeFun="closeFun"
        @getnewList="getnewList"
      />
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { getFile, postFileDownloadUrl, getFileTree, postFileDelete } from '@/api/home'
import { download } from '@/utils/utils'
import { ElMessage, ElMessageBox  } from 'element-plus'
import dialogHome from './dialogHome.vue'

interface Tree {
  id: number
  path: string
  title: string
  'is_dir': boolean
  summary?: string
  tags?: string[]
  children?: Tree[]
}

interface dialogType {
  path: string
  isfile: boolean
  modifyData?: any
  visible: boolean
  ismodify:boolean
}

const dialog = reactive<dialogType>({
  path: '/',
  isfile: true,
  modifyData: {},
  visible: false,
  ismodify: false
})

const defaultProps = {
  children: 'children',
  label: 'title'
}

const allId = ref<number[]>([])

const treeData = ref([])

const tableData = ref<Tree[]>([])

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
  dialog.visible = true
}

const closeFun = () => {
  dialog.modifyData = {}
  dialog.path = '/'
  dialog.visible = false
  dialog.ismodify = false
}

const handleNodeClick = (data: Tree) => {
  dialog.path = data.path
  getfileList({ dirname: data.path })
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

const deleteAjaxFun = async(parems:number[]) => {
  try {
    const { deleted } = await postFileDelete({ ids:parems })
    if(deleted){
      getfileList({ dirname: dialog.path })
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteFun = (parems:number) => {
  ElMessageBox.confirm('是否确定删除此条文件?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      deleteAjaxFun([parems])
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消'
      })
    })
}

const allDeleteFun = ()=> {
  ElMessageBox.confirm('是否确定批量删除这些文件?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      let arry = allId.value.map((item) => {
        return item
      })
      deleteAjaxFun(arry)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消'
      })
    })
}

const reviseFun = (parems: Tree) => {
  dialog.modifyData = parems
  dialog.ismodify = true
  addFile(true)
}

const addNewFile = () => {
  dialog.modifyData = {}
  dialog.ismodify = false
  addFile(true)
}

const getnewList = (parems: string) => {
  getfileList({ dirname: parems })
}

const getTressData = async()=>{
  try {
    const res = await getFileTree()
    console.log(res)
    treeData.value = res
  } catch (error) {
    console.log(error)
  }
}

getfileList({ dirname: '/' })

getTressData()
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
