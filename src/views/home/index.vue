<template>
  <el-row>
    <el-col class="bread" :span="18">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>homepage</el-breadcrumb-item>
        <el-breadcrumb-item>promotion management</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="addFile(false)">新增文件夹</el-button>
    </el-col>
    <el-col class="treebg" :span="8">
      <el-tree
        :data="treeList"
        :props="defaultProps"
        node-key="id"
        :default-expanded-keys="keys"
        accordion
        @node-click="handleNodeClick"
      />
    </el-col>
    <el-col :span="16">
      <!-- <el-button type="primary" @click="addFile(true)">新增文件</el-button> -->
    </el-col>
    <dialogHome
      :visible="visible"
      :path="dialog.path"
      :isfile="dialog.isfile"
      @closeFun="closeFun"
    />
  </el-row>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref, reactive } from 'vue'
import dialogHome from './dialogHome.vue'
import { getFile } from '@/api/home'
import { ArrowRight } from '@element-plus/icons-vue'
const visible = ref(false)

const defaultProps = {
  children: 'children',
  label: 'title'
}

const dialog = reactive({
  path:'/',
  isfile: true
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

const getfileList = async()=>{
  try {
    const { list } = await getFile({ dirname:'/' })
    let newList = [list[0]]
    newList[0].children = list.slice(1,list.length)
    newList[0].children.map((item)=>keys.value.push(item.id))
    treeList.value = newList
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
  getfileList()
}

const handleNodeClick = ( data: Tree )=> {
  dialog.path = data.path
  console.log(data)
}

getfileList()

</script>

<style scoped lang="scss">
.bread{
  padding-bottom: 20px;
}
.treebg{
  background-color: #fff;
}
</style>
