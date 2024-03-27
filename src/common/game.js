import SUG from 'bixin-sug'
// import * as API from './api'
import { SDK_MSG_STATE_GAME, SDK_MSG_STATE_H5 } from './config'
import {  generateUUID } from './util'
import axios from 'axios'
class SDKGameView {
  sdk = null // 适配层sdk实例
  gameCode = '' // 游戏code
  devGameUrl = '' // 本地调试ip
  joinGameLimitFunc = undefined // 点击加入游戏回调
  roomId = ''
  // 初始化数据
  constructor (
    { root, gameCode, devGameUrl, joinGameLimitFunc, roomId }) {
    if (root) { // 挂载iframe元素
      this.roomId = roomId
      this.sdk = new SUG({ root })
      this.gameCode = gameCode
      joinGameLimitFunc && (this.joinGameLimitFunc = joinGameLimitFunc)
      devGameUrl && (this.devGameUrl = devGameUrl)
    }
  }

  /**
   * 第1步，获取短期令牌code，用于校验用户身份
   */
  _getCode () {
    try {
      return axios.post('https://gateway.bxyuer.com/game/center/get_code')
    } catch (err) {
      console.log('err', err)
    }
  }

  /**
   * 第2步，初始化 适配层sdk
   */
  async _initSDK ({ initSdkSuccess, initSdkFail } = {}) {
    return new Promise((resolve, reject) => {
      try {
        this._getCode().then((res = {}) => {
          const { appCode, code, appSecret } = res.data.result
          this.sdk && this.sdk.initSDK(
            {
              appCode, // 应用code
              token: code, // 用户token
              signSecret: appSecret, // 加密公钥
              gameCode: this.gameCode, // 游戏Code
            },
            {
              onSuccess () {
                resolve()
                initSdkSuccess && initSdkSuccess()
              },
              onFail (err) {
                console.log('err', err)
                reject(err)
                initSdkFail && initSdkFail(err)
              },
            },
          )
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }

  /**
   * 第3步，加载游戏，监听游戏回调事件
   */
  async loadGame (
    {
      loadGameParams = {}, // 加载游戏参数
      loadGameExtParams = {}, // 加载游戏额外参数
      beforeInitSdk, // 初始化sdk前回调
      initSdkSuccess, // 初始化sdk成功回调
      initSdkFail, // 初始化sdk失败回调
      loadGameSuccess, // 加载游戏成功回调
      loadGameFail, // 加载游戏失败回调
    } = {},
    {
      onGetGameViewInfo, // UI相关
      onGameStateChange, // 游戏相关
      onPlayerStateChange, // 玩家相关
      onGameCustomerStateChange, // 自定义事件
      onGameLog, // 日志相关
    } = {},
  ) {
    try {
      beforeInitSdk && beforeInitSdk()
      await this._initSDK({ initSdkSuccess, initSdkFail })
      this.sdk.loadGame(
        {
          gameCode: this.gameCode,
          devGameUrl: this.devGameUrl,
          joinGameLimitFunc: this.joinGameLimitFunc,
        },
        {
          onSuccess: () => {
            const roomId = this.roomId || ( 'ab0ffdc87d3b4a838867b58ba6dfbf7d')
            this.sdk.notifyStateChange({
              state: SDK_MSG_STATE_H5.h5_common_load_game,
              data: {
                roomId,
                code: `viewer_${generateUUID()}`, // 长链需要(用户 || 游客)
                ...loadGameParams,
                ext: {
                  ...loadGameExtParams,
                },
              },
            })
            loadGameSuccess && loadGameSuccess()
          },
          onFail: (err) => {
            loadGameFail && loadGameFail(err)
          },
        },
        {
          // eslint-disable-next-line camelcase
          onGetGameViewInfo ({ view_size, view_game_rect } = {}) {
            onGetGameViewInfo && onGetGameViewInfo({ view_size, view_game_rect })
          },
          onGameStateChange: message => {
            switch (message.state) {
              // 退出游戏
              case SDK_MSG_STATE_GAME.mg_common_exit_game:
                break
            }
            onGameStateChange && onGameStateChange(message)
          },
          onPlayerStateChange: message => {
            onPlayerStateChange && onPlayerStateChange(message)
          },
          onGameCustomerStateChange: message => {
            onGameCustomerStateChange && onGameCustomerStateChange(message)
          },
          onGameLog ({ type, data }) {
            onGameLog && onGameLog({ type, data })
          },
        },
      )
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }

  // H5通知游戏
  notifyStateChange (message) {
    this.sdk && this.sdk.notifyStateChange(message)
  }

  // 销毁游戏
  destroyMG () {
    this.sdk && this.sdk.destroyMG()
    this.sdk = null
  }
}

export default SDKGameView
