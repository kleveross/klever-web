export const statusMap = {
  model: {
    pending: {
      status: 'default',
      text: '等待中',
    },
    running: {
      status: 'processing',
      text: '$1中',
    },
    deleting: {
      status: 'warning',
      text: '删除中',
    },
    succeeded: {
      status: 'success',
      text: '$1成功',
    },
    failed: {
      status: 'error',
      text: '$1失败',
    },
  },
  serving: {
    creating: {
      status: 'default',
      text: '创建中',
    },
    available: {
      status: 'success',
      text: '正常',
    },
    failed: {
      status: 'error',
      text: '异常',
    },
  },
};
