<template>
  <div class="image-uploader">
    <div class="uploader-list">
      <div class="uploader" v-for="(item, index) in controlData" :key="index">
        <el-upload
          v-if="!item.loading"
          action=""
          :accept="accept"
          :http-request="e => handleRequest(e, item, index)"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
        >
          <div class="img-area" v-if="item.img">
            <img :src="item.img" />
            <div class="del-btn" @click.stop="handleDeleteImg(index)">
              <i class="el-icon-delete" />
            </div>
          </div>
          <div class="upload-area" v-else>
            <el-button type="primary" size="small">点击上传</el-button>
          </div>
        </el-upload>
        <el-progress
          v-if="item.loading"
          type="circle"
          :percentage="item.process"
          :status="item.process === 100 ? 'success' : undefined"
        />
      </div>
    </div>
    <div>
      <el-tag type="info">
        建议尺寸：{{ width }}*{{ height }}px，{{ acceptText }}格式，图片小于{{ fileSize }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { upload } from '@/services/course'

interface ControlDataType {
  img: string
  loading: boolean
  process: number
}

export default Vue.extend({
  name: 'ImageUpload',
  props: {
    value: {
      type: [String, Array] as PropType<string | string[]>,
      required: true
    },
    width: {
      type: [String, Number],
      default: 230
    },
    height: {
      type: [String, Number],
      default: 300
    },
    accept: {
      type: String,
      default: 'image/png, image/jpeg'
    },
    size: {
      type: Number,
      default: 150 * 1024
    },
    count: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      controlData: [] as ControlDataType[]
    }
  },
  computed: {
    fileSize () {
      if (this.size / 1024 / 1024 > 1) {
        return `${Math.floor(this.size / 1024 / 1024 * 100) / 100}MB`
      } else if (this.size / 1024 > 1) {
        return `${Math.floor(this.size / 1024 * 100) / 100}KB`
      } else {
        return `${this.size}B`
      }
    },
    acceptText () {
      const arr = this.accept.toUpperCase().split(/\s*,\s*/)

      return arr.join('、').replace(/IMAGE\//g, '')
    }
  },
  watch: {
    value (v) {
      this.initControlData(v)
    }
  },
  mounted () {
    this.initControlData(this.value)
  },
  methods: {
    initControlData (value: string | string[]) {
      const data = Array.isArray(value) ? value : [value]

      if (data.length === 0 || data.length < this.count) {
        data.push('')
      }

      this.controlData = data.map((v: string) => ({
        img: v,
        loading: false,
        process: 0
      }))
    },
    async handleRequest (
      { file }: { file: File },
      item: ControlDataType,
      index: number
    ) {
      const formData = new FormData()

      formData.append('file', file)
      item.loading = true
      const res = await upload(formData, e => {
        item.process = Math.floor(e.loaded / e.total * 100)
      })

      item.img = res.name
      if (Array.isArray(this.value)) {
        this.$emit('input', this.controlData.map(v => v.img))
        if (this.controlData.length < this.count) {
          this.controlData.push({ img: '', process: 0, loading: false })
        }
      } else {
        this.$emit('input', res.name)
      }
      item.loading = false
    },
    handleBeforeUpload (file: File) {
      const acceptList = this.accept.split(/\s*,\s*/)
      const allowFormat = acceptList.includes(file.type)
      const allowSize = file.size < this.size

      if (!allowFormat) {
        this.$message.error(`上传头像图片只能是 ${this.acceptText} 格式!`)
      }
      if (!allowSize) {
        this.$message.error(`上传头像图片大小不能超过 ${this.fileSize}!`)
      }
      return allowFormat && allowSize
    },
    handleDeleteImg (index: number) {
      this.controlData.splice(index, 1)
      if (Array.isArray(this.value)) {
        this.$emit('input', this.controlData.map(v => v.img))
      } else {
        this.$emit('input', '')
      }

      if (!this.controlData.filter(v => !v.img).length) {
        this.controlData.push({ img: '', process: 0, loading: false })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.image-uploader {
  .uploader-list {
    display: flex;
    flex-wrap: wrap;
  }
  .uploader {
    margin-right: 12px;
  }
  &::v-deep {
    .el-upload {
      position: relative;
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    .upload-area {
      border-radius: 6px;
      border: 1px dashed #c0ccda;
      color: #c0ccda;
      &:hover {
        border-color: #40586f;
        color: #40586f;
      }
    }
    .del-btn {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: rgba(#000, 0.5);
      opacity: 0;
      transition: opacity .3s;
      font-size: 20px;
      color: #fff;
      &:hover {
        opacity: 1;
      }
    }
    .el-progress {
      padding: 12px;
    }
  }
  .upload-area {
    font-size: 28px;
    width: 148px;
    height: 148px;
    background: #fbfdff;
    line-height: 148px;
    text-align: center;

    button {
      vertical-align: middle;
    }
  }
  img {
    display: block;
    width: 148px;
    height: 148px;
  }
}
</style>
