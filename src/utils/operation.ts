import { Form } from 'element-ui'

export async function delRow (obj: {
  vueInstance: any,
  delRequest: () => Promise<void>,
  listRequest: () => Promise<any>
}) {
  try {
    const rs = await obj.vueInstance.$confirm('确认要删除？', '提示')

    if (rs === 'confirm') {
      const loading = obj.vueInstance.$loading({ text: '删除中' })

      await obj.delRequest()
      await obj.listRequest()
        .finally(() => loading.close())

      obj.vueInstance.$message.success('删除成功')
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function saveForm (obj: {
  vueInstance: any,
  formRef: Form | Form[],
  saveRequest: () => Promise<void>,
  listRequest?: () => Promise<any>,
  isEditMode?: boolean
}) {
  const refs = Array.isArray(obj.formRef) ? obj.formRef : [obj.formRef]
  const validRes = await Promise.all(
    refs.map(ref => ref.validate().catch(e => e))
  )

  if (validRes.some(v => !v)) {
    obj.vueInstance.$message.error('验证失败')
    throw new Error('验证失败')
  }

  let loading
  try {
    loading = obj.vueInstance.$loading({ text: '提交中...' })
    await obj.saveRequest()
    obj.listRequest && await obj.listRequest()
    obj.vueInstance.$message.success(obj.isEditMode ? '修改成功' : '添加成功')
  } catch (e) {
    throw new Error(e.message)
  } finally {
    loading && loading.close()
  }
}
