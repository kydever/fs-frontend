<template>
  <div>
    <div>
      <el-radio-group
        v-model="multiple"
        :disabled="disabled"
        class="ml-4"
        @change="radioChangeFun"
      >
        <el-radio :label="0" size="large">单文件上传</el-radio>
        <el-radio :label="1" size="large">多文件上传</el-radio>
      </el-radio-group>
    </div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      :multiple=" multiple ? true : false "
      action=""
      :auto-upload="false"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :limit="multiple ? 999 : 1"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">选择上传文件</div>
    </el-upload>
    <el-input v-model="ruleForm.summary" placeholder="请输入备注" />
    <div class="tag_div">
      <el-input v-model="tagtext" placeholder="请输入标签" />
      <el-button type="primary" @click="addTagFun">添加标签</el-button>
    </div>
    <el-tag
      v-for="tag in ruleForm.tags"
      :key="tag"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <div class="but_div">
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="primary"
        plain
        @click="submitUpload"
      >
        上传
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, defineEmits, reactive, defineExpose } from 'vue'
import { postFileId, postFileUpload } from '@/api/home'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'

const uploadRef = ref<UploadInstance>()

const props = defineProps({
  path:{
    type: String
  },
  ismodify:{
    type :Boolean
  },
  modifyData:{
    type:Object
  }
})

const emit = defineEmits(['closeFun', 'getnewList'])


interface ruleFormtype {
    id: string
    path: string
    file: any
    summary: string
    tags: string[]
}

const ruleForm = reactive<ruleFormtype>({
  id: '0',
  path: '/',
  file: '',
  summary: '',
  tags: []
})

const flieName = ref<string>('')

const tagtext = ref<string>('')

const disabled = ref<boolean>(false)

const lodPath = ref<string>('')

const isChoiceFlie = ref<boolean>(false)

const fullscreenLoading = ref(false)

let formData = new FormData()

let i = 0

const multiple = ref<number>(0)

// 回显
const echoFun = (parems) =>{
  disabled.value = true
  ruleForm.summary = parems.summary
  ruleForm.tags = parems.tags
  ruleForm.id = parems.id
  lodPath.value = JSON.parse(JSON.stringify(parems.path))
}

watch(
  ()=>[props.path,props.ismodify,props.modifyData],
  (val:any[])=>{
    ruleForm.path = val[0] || '/'
    if(val[1]){
      echoFun(val[2])
    }
  },
  { immediate: true }
)

// 选择文件
const handleChange = (uploadFile)=>{
  if(multiple.value){
    formData.append(`files${i}`,uploadFile.raw)
    i++
  }else{
    formData.append('file',uploadFile.raw)
    flieName.value = uploadFile.name
    isChoiceFlie.value = true
  }
}

// 重置上传组件和FormData
const radioChangeFun = () => {
  uploadRef.value?.clearFiles()
  formData = new FormData()
}

// 重置数据
const resetDataFun = ()=>{
  ruleForm.id = '0'
  ruleForm.path = '/'
  ruleForm.file = ''
  ruleForm.summary = ''
  ruleForm.tags = []
  tagtext.value = ''
  multiple.value = 0
  isChoiceFlie.value = false
  lodPath.value = ''
  radioChangeFun()
}

// 上传后获取新的数据
const getnewList = () => {
  emit('getnewList',ruleForm.path)
  emit('closeFun')
}

// 回调成功调用
const successFial = ()=>{
  ElMessage({
    message: '文件上传成功',
    type: 'success'
  })
  getnewList()
  resetDataFun()
}

// 给formData对象添加数据
const addKeyData = () =>{
  formData.append('summary', ruleForm.summary)
  formData.append('tags', ruleForm.tags.toString())
}

// 单文件提交
const singleFileFun = async()=>{
  try {
    // 判断修改是否提交文件
    if(isChoiceFlie.value){
      formData.append('path', ruleForm.path==='/' ? `/${flieName.value}` : `${ruleForm.path}/${flieName.value}`)
    } else {
      formData.append('path', lodPath.value)
    }
    addKeyData()
    const { saved } = await postFileId(ruleForm.id,formData)
    if(saved){
      successFial()
    }
  } catch (error) {
    uploadRef.value?.clearFiles()
  } finally {
    formData = new FormData()
    fullscreenLoading.value = false
  }
}

// 多文件提交
const multipleFilesFun =  async() =>{
  try {
    formData.append('dirname', ruleForm.path==='/' ? `` : ruleForm.path)
    addKeyData()
    const { saved } = await postFileUpload(formData)
    if(saved){
      successFial()
    }
  } catch (error) {
    uploadRef.value?.clearFiles()
    console.log(error)
  } finally {
    formData = new FormData()
    fullscreenLoading.value = false
  }
}

// 提交方法
const submitUpload = ()=>{
  fullscreenLoading.value = true
  if(multiple.value){
    // 多文件提交
    multipleFilesFun()
  }else{
    // 单文件提交
    singleFileFun()
  }
}

// tag添加数据
const addTagFun = ()=>{
  if(!tagtext.value) return
  if(ruleForm.tags.indexOf(tagtext.value) === -1){
    ruleForm.tags.push(tagtext.value)
    tagtext.value = ''
  }else{
    ElMessage({
      message: '不能添加重复标签',
      type: 'warning'
    })
    tagtext.value = ''
  }
}

// tag删除数据
const handleClose = (tag: string) => {
  ruleForm.tags.splice(ruleForm.tags.indexOf(tag), 1)
}

// 关闭事件
const closeDialog = () => {
  resetDataFun()
  emit('closeFun')
}

const handleExceed = () => {
  ElMessage({
    message: '文件数量超过限制',
    type: 'success'
  })
}

// 暴露重置方法
defineExpose({ resetDataFun })

</script>
<style scoped lang="scss">
.upload-demo{
    margin-bottom: 10px;
    :deep(.el-upload--text){
        width: 100%;
    }
    :deep(.el-upload-dragger){
        width: 100%;
    }
}
.but_div{
    padding-top: 20px;
    text-align: right;
}
.tag_div{
    display: flex;
    padding: 10px 0;
    .el-button{
        margin-left: 8px;
    }
}
</style>
