import { Form } from 'element-ui'

export async function delRow (obj: {
  vueInstance: any,
  delRequest: () => Promise<void>,
  listRequest: () => Promise<any>
}) {
  try {
    const rs = await obj.vueInstance.$confirm('确认要删除', '提示')

    if (rs === 'confirm') {
      const loading = obj.vueInstance.$loading({ text: '删除中' })

      await obj.delRequest()
      await obj.listRequest()
        .finally(() => loading.close())

      obj.vueInstance.$message.success('删除成功')
    }
  } catch (e) {}
}

export async function saveForm (obj: {
  vueInstance: any,
  formRef: Form,
  saveRequest: () => Promise<void>,
  listRequest?: () => Promise<any>,
  isEditMode?: boolean
}) {
  const validRes = await obj.formRef.validate().catch(e => e)

  if (!validRes) {
    obj.vueInstance.$message.error('验证失败')
    return
  }

  let loading
  try {
    loading = obj.vueInstance.$loading({ text: '提交中...' })
    await obj.saveRequest()
    obj.listRequest && await obj.listRequest()
    obj.vueInstance.$message.success(obj.isEditMode ? '修改成功' : '添加成功')
  } catch (e) {
  } finally {
    loading && loading.close()
  }
}
