// 获取url？后的指定参数
export const getUrlKey = (name, url) => {
  const result = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url || window.location.href)
  return decodeURIComponent((result || ['', ''])[1].replace(/\+/g, '%20'))
}

export const WebviewEnvEnum = {
  GAME: 'GAME',
  DIALOG: 'DIALOG',
}

// 机器人id
export const robotId = getUrlKey('robotId') || ''
// 是否是机器人
export const isRobot = !!robotId && !getEnv().isProd
// 发布消息到父容器
export const postMessageToParent = (type, params, extra) => {
  if (!isRobot) return
  window.parent.postMessage(
    {
      ...params,
      type,
      webviewEnv: extra?.webviewEnv || WebviewEnvEnum.GAME,
      robotId,
    },
    '*',
  )
}

// 生成32位uuid
export const generateUUID = () => {
  return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 获取链接参数
export const parseUrlSearch = search => {
  const res = {}
  if (search.startsWith('?')) search = search.slice(1)
  if (search) {
    search.split('&').forEach(pair => {
      if (pair) {
        const [key, val = ''] = pair.split('=').map(decodeURIComponent)
        res[key] = val
      }
    })
  }
  return res
}

// 格式化麦位
export const formatSeat = (seatIndex, gameCode) => {
  switch (gameCode) {
    // 炸弹啵啵
    case 'BOMB_WAVE':
      if (seatIndex === 'master') return { seatIndex: 0, seatDesc: '主持' }
      if (seatIndex === '-1') return { seatIndex: -1, seatDesc: '观众' }
      if (seatIndex === '0') return { seatIndex: 99, seatDesc: '嘉宾' } // 嘉宾特殊处理（置于末位 ）
      return { seatIndex: +seatIndex, seatDesc: `${+seatIndex}号` }

    default:
      if (seatIndex === 'master') return { seatIndex: 0, seatDesc: '主持' }
      if (seatIndex === '-1') return { seatIndex: -1, seatDesc: '观众' }
      if (seatIndex === '0') return { seatIndex: 1, seatDesc: '嘉宾' }
      return { seatIndex: +seatIndex + 1, seatDesc: `${+seatIndex}号` }
  }
}

// 版本字符串比较
export const versionStringCompare = (preVersion = '', lastVersion = '') => {
  const sources = preVersion.split('.')
  const dests = lastVersion.split('.')
  const maxL = Math.max(sources.length, dests.length)
  let result = 0
  for (let i = 0; i < maxL; i++) {
    const preValue = sources.length > i ? sources[i] : 0
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
    const lastValue = dests.length > i ? dests[i] : 0
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
    if (preNum < lastNum) {
      result = -1
      break
    } else if (preNum > lastNum) {
      result = 1
      break
    }
  }
  return [0, 1].includes(result)
}


/**
 * @param isTestOrEnv
 * @param options.enableUat 是否检查当前 url 是否是 uat 环境（许多基础系统都没有 uat 环境，如埋点）
 */
export function getEnvObject (isTestOrEnv, options = {}) {
  let prefix = ''

  if (typeof isTestOrEnv === 'boolean') {
    prefix = isTestOrEnv ? 'test' : ''
  } else if (typeof isTestOrEnv === 'string') {
    prefix = isTestOrEnv === 'prod' ? '' : isTestOrEnv
  } else {
    const host = options.host || (typeof window.location !== 'undefined' ? window.location.host : '')

    if (/^uat[-.]/.test(host)) prefix = 'uat'
    else if (/^test[-.]/.test(host) || (host || '').startsWith('localhost') || /^\d+(\.\d+){3}/.test(host)) {
      prefix = 'test'
    }
  }

  if (!options.enableUat && prefix === 'uat') prefix = ''

  return prefix + (prefix ? '-' : '')
}

// 获取环境
export function getEnv (options = {}) {
  const prefix = getEnvObject(null, { enableUat: true, ...options })
  const name = (prefix.replace('-', '') || 'prod')
  return {
    name,
    prefix,
    isTest: prefix === 'test-',
    isUat: prefix === 'uat-',
    isProd: prefix === '',
  }
}

/**
 * localStorage方法
 * @param localName 本地缓存名称
 */
export function useLocalstorage (localName) {
  const set = (value) => {
    localStorage.setItem(localName, JSON.stringify(value))
  }

  const get = () => JSON.parse(localStorage.getItem(localName))

  const remove = () => {
    localStorage.removeItem(localName)
  }

  const clear = () => {
    localStorage.clear()
  }

  return {
    set,
    get,
    remove,
    clear,
  }
}
