<template>
  <div>
    <el-card :body-style="{ padding: 0 }">
      <!-- 大标题 -->
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <h3>课程名称：{{ course.courseName }}</h3>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleNewSection"
          >
            添加阶段
          </el-button>
        </el-row>
      </div>
      <!-- /大标题 -->

      <!-- 树列表 -->
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
      >
        <span class="tree-node-row" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              size="small"
              @click.stop="'sectionName' in data ? handleEditSection(data) : handleEditLesson(data, node)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="primary"
              v-if="'sectionName' in data"
              @click.stop="handleNewLesson(data, node)"
            >
              添加课时
            </el-button>
            <el-button
              size="small"
              type="success"
              v-else
              @click.stop="$router.push(`/courses/${data.id}/video`)"
            >
              上传视频
            </el-button>
            <el-button
              size="small"
              @click.stop="handleShowStatusModal(data)"
            >
              {{getStatusLabel(data)}}
            </el-button>
          </span>
        </span>
      </el-tree>
      <!-- /树列表 -->
    </el-card>

    <!-- 添加和编辑阶段弹窗 -->
    <el-dialog title="章节信息" :visible.sync="sectionModalVisible">
      <el-form ref="sectionFormRef" :model="sectionFormData" label-width="80px" :rules="sectionRules">
        <el-form-item label="课程名称" required>
          <el-input :value="course.courseName" disabled />
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName" required>
          <el-input v-model="sectionFormData.sectionName" />
        </el-form-item>
        <el-form-item label="章节描述">
          <el-input type="textarea" v-model="sectionFormData.description" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input type="number" v-model="sectionFormData.orderNum">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="sectionModalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSection">确定</el-button>
      </div>
    </el-dialog>
    <!-- /添加和编辑阶段弹窗 -->

    <!-- 添加和编辑课时弹窗 -->
    <el-dialog title="课时基本信息" :visible.sync="lessonModalVisible">
      <el-form ref="lessonFormRef" :model="lessonFormData" label-width="120px" :rules="lessonRules">
        <el-form-item label="课程名称" required>
          <el-input :value="course.courseName" disabled />
        </el-form-item>
        <el-form-item label="章节名称" required>
          <el-input v-model="lessonFormData.sectionName" disabled />
        </el-form-item>
        <el-form-item label="课时名称" required prop="theme">
          <el-input v-model="lessonFormData.theme" />
        </el-form-item>
        <el-form-item label="时长" required prop="duration">
          <el-input type="number" v-model="lessonFormData.duration">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" required prop="isFree">
          <el-switch v-model="lessonFormData.isFree" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input type="number" v-model="lessonFormData.orderNum">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="lessonModalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveLesson">确定</el-button>
      </div>
    </el-dialog>
    <!-- /添加和编辑课时弹窗 -->

    <!-- 更改状态弹窗 -->
    <el-dialog title="提示" :visible.sync="statusModalVisible">
      <el-row type="flex" style="flex-direction:column" justify="center" align="middle">
        <i class="el-icon-info" style="margin-bottom: 20px;font-size: 50px;" />
        <div style="font-size: 20px;margin-bottom:20px">当前状态：{{getStatusLabel(statusFormData)}}</div>
      </el-row>
      <el-form :model="statusFormData" label-width="100px">
        <el-form-item label="状态变更为">
          <el-select v-model="statusFormData.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="statusModalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveStatus">确定</el-button>
      </div>
    </el-dialog>
    <!-- /更改状态弹窗 -->

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Section, getCourseById, getSectionAndLesson, Lesson, saveOrUpdateSection, saveOrUpdateLesson, Course } from '@/services/course'
import { TreeNode } from 'element-ui/types/tree'
import { saveForm } from '@/utils/operation'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CoursesUpdate',
  data () {
    return {
      id: +this.$route.params?.id,
      sections: [] as Section[],
      course: {} as Course,
      defaultProps: {
        children: 'lessonDTOS',
        label: (v: Section | Lesson) => 'sectionName' in v ? v.sectionName : v.theme
      },
      sectionModalVisible: false,
      sectionFormData: {},
      sectionRules: {
        sectionName: { required: true, message: '请输入章节名称' }
      },
      lessonModalVisible: false,
      lessonFormData: {},
      lessonRules: {
        theme: { required: true, message: '请输入课时名称' },
        duration: { required: true, message: '请输入时长' }
      },
      statusModalVisible: false,
      statusFormData: {} as {
        id: number,
        status: number,
        isSection: boolean
      },
      statusOptions: [
        { label: '已隐藏', value: 0 },
        { label: '待更新', value: 1 },
        { label: '已更新', value: 2 }
      ]
    }
  },
  created () {
    if (!this.id) {
      this.$router.replace('/Courses')
    }
  },
  mounted () {
    this.initSection()
    this.initCourse()
  },
  methods: {
    async initSection () {
      this.sections = await getSectionAndLesson(this.id)
    },
    async initCourse () {
      this.course = await getCourseById(this.id)
    },
    handleAllowDrop (
      { data: d1 }: TreeNode<string, Section | Lesson>,
      { data: d2 }: TreeNode<string, Section | Lesson>,
      type: 'prev' | 'inner' | 'next'
    ) {
      // 不允许转为子节点
      if (type === 'inner') {
        return false
      }
      // 都是外部节点可以互相移动
      if ('sectionName' in d1 && 'sectionName' in d2) {
        return true
      }
      // 都是内部节点 && 属于同一个外部节点时可以移动
      if ('theme' in d1 && 'theme' in d2 && d1.sectionId === d2.sectionId) {
        return true
      }
      return false
    },
    async handleNodeDrop (
      drapNode: TreeNode<string, Section | Lesson>,
      dropNode: TreeNode<string, Section | Lesson>
    ) {
      const loading = this.$loading({ text: '排序中...' })
      try {
        await Promise.all((dropNode.parent?.childNodes || []).map((node, i) => {
          const request = 'sectionName' in node.data ? saveOrUpdateSection : saveOrUpdateLesson

          return request({ id: node.data.id, orderNum: i + 1 })
        }))
        this.$message.success('排序成功')
      } catch (e) {
        this.$message.error('排序失败')
      } finally {
        loading.close()
      }
    },
    handleNewSection () {
      this.sectionFormData = {
        courseId: this.course.id,
        sectionName: '',
        description: '',
        orderNum: 0
      }
      this.sectionModalVisible = true
    },
    handleEditSection (data: Section) {
      this.sectionFormData = data
      this.sectionModalVisible = true
    },
    handleNewLesson (data: Section) {
      this.lessonFormData = {
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        courseId: this.course.id,
        sectionName: data.sectionName,
        sectionId: data.id
      }
      this.lessonModalVisible = true
    },
    handleEditLesson (data: Lesson, node: TreeNode<string, Section>) {
      this.lessonFormData = {
        ...data,
        sectionName: node.parent!.data.sectionName
      }
      this.lessonModalVisible = true
    },
    async handleSaveSection () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.sectionFormRef as Form[],
        saveRequest: () => saveOrUpdateSection(this.sectionFormData),
        isEditMode: 'in' in this.sectionFormData
      })
      this.sectionModalVisible = false
      this.initSection()
    },
    async handleSaveLesson () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.lessonFormRef as Form[],
        saveRequest: () => saveOrUpdateLesson(this.lessonFormData),
        isEditMode: 'id' in this.lessonFormData
      })
      this.lessonModalVisible = false
      this.initSection()
    },
    getStatusLabel (data: Section | Lesson) {
      let text = '已隐藏'

      this.statusOptions.forEach(item => {
        if (item.value === data.status) {
          text = item.label
        }
      })
      return text
    },
    handleShowStatusModal (data: Section | Lesson) {
      this.statusFormData = {
        id: data.id,
        status: data.status,
        isSection: 'sectionName' in data
      }
      this.statusModalVisible = true
    },
    async handleSaveStatus () {
      const loading = this.$loading({ text: '更新状态中...' })
      const { id, status } = this.statusFormData
      const data = { id, status }

      try {
        this.statusFormData.isSection
          ? await saveOrUpdateSection(data)
          : await saveOrUpdateLesson(data)
        this.$message.success('状态更新成功')
        this.initSection()
        this.statusModalVisible = false
      } catch (e) {
        this.$message.error('状态更新失败')
      } finally {
        loading.close()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tree-node__content {
    height: auto;
  }
  .el-tree-node__expand-icon {
    padding: 15px;
    font-size: 20px;
  }
}
h3 {
  margin: 0;
}
.tree-node-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 9px;
  border-bottom: 1px solid rgba(0,0,0,.05);
}
</style>
