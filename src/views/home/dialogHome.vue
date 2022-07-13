<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isfile?'上传文件':'新增文件夹'"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      v-if="isfile"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="上传文件" prop="fileList">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :action="actionurl"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :data="ruleForm"
          :headers="headersData"
          :on-success="successFun"
          :on-error="errorFun"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="ruleForm.summary" clearable />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <div class="tags_div">
          <el-input v-model="tagtext" clearable class="tagtext" />
          <el-button @click="addTags">添加标签</el-button>
        </div>
        <el-tag
          v-for="tag in ruleForm.tags"
          :key="tag.id"
          class="mx-1"
          closable
          :type="tag.type"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
      </el-form-item>
    </el-form>
    <el-input v-if="!isfile" v-model="dirname" clearable />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="submitFun">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch, defineEmits, reactive } from 'vue'
import type { UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { postFileId } from '@/api/home'
import dayjs from 'dayjs'
const props = defineProps({
  visible: {
    type: Boolean
  },
  path:{
    type: String
  },
  isfile:{
    type: Boolean
  },
  data:{
    type: Object
  }
})

const emit = defineEmits(['closeFun'])

const dialogVisible = ref(false)

const ruleForm = reactive({
  id: 0,
  path: '',
  summary: '',
  tags: []
})

const dirname = ref('')

const tagtext = ref('')

const headersData = {
  'work-wx-token': getToken()
}

const actionurl = ref(`/api/file/${ruleForm.id}`)

watch(
  ()=>[props.visible,props.path,props.data],
  (val)=>{
    dialogVisible.value = val[0]
    ruleForm.path = val[1]
    // ruleForm.id = val[2]
    if(val[2].id){
      echoDataFun(val[2])
    }
  },
  { immediate: true }
)


const uploadRef = ref<UploadInstance>()

const handleChange = (uploadFile) => {
  if(!uploadFile.raw.type){
    ElMessage({
      message: '文件类型不支持',
      type: 'warning'
    })
    uploadRef.value!.clearFiles()
    return
  }
  ruleForm.path = `${ruleForm.path}/${uploadFile.name}`
}

const handleExceed = () => {
  ElMessage({
    message: '只能一个一个上传请删除后再上传',
    type: 'warning'
  })
}

const handleClose = () => {
  dialogVisible.value = false
  emit('closeFun')
}

const submitUpload = () => {
  if(!uploadRef.value!.submit()) return
}

const successFun = (response) => {
  if( !response.code ){
    ElMessage({
      message: '上传成功！',
      type: 'success'
    })
    uploadRef.value!.clearFiles()
    ruleForm.summary = ''
    ruleForm.tags = []
    tagtext.value = ''
  } else {
    ElMessage({
      message: response.message,
      type: 'error'
    })
  }
}

const errorFun = () => {
  ElMessage({
    message: '上传失败！请稍后再试',
    type: 'error'
  })
  uploadRef.value!.clearFiles()
}

const addTags = ()=>{
  if(!tagtext.value) return
  ruleForm.tags.push(tagtext.value)
  tagtext.value = ''
}

const submitFun = async()=>{
  try {
    const body = {
      id: 0,
      dirname: dirname.value,
      path: ruleForm.path === '/' ? `${ruleForm.path}${dirname.value}`:`${ruleForm.path}/${dirname.value}`
    }
    const { saved } = await postFileId(body.id,body)
    if( saved ){
      ElMessage({
        message: '文件新增成功！',
        type: 'success'
      })
      dirname.value = ''
      emit('closeFun')
    }
  } catch (error) {
    console.log(error)
  }
}

const echoDataFun = (parems) => {
  let i = parems.path.lastIndexOf('/')
  ruleForm.summary = parems.summary
  ruleForm.id = parems.id
  ruleForm.tags = parems.tags
  ruleForm.path = parems.path.substring(0, i)
  actionurl.value = `/api/file/${ruleForm.id}`
}

</script>

<style scoped lang="scss">
.dialog-footer{
  margin-right: 10px;
}

.tagtext{
  width: 200px;
}
.tags_div{
  width: 100%;
  padding-bottom: 10px;
  .el-button{
    margin-left: 8px;
  }
}
.ml-3{
  margin-left: 8px;
}
</style>
