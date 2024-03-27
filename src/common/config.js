// 应用code，必须要填写
export const APP_CODE = '2000'

// 游戏code，必须要填写(新增游戏可以不断添加key)
export const GAME_CODE_MAP = {
  who_is_spy: 'WHO_IS_SPY', // 谁是卧底
  bomb_wave: 'BOMB_WAVE', // 炸弹啵啵
  heart_challenge: 'HEART_CHALLENGE', // 心动挑战
}

// 通用状态key（游戏回调事件）
export const SDK_MSG_STATE_GAME = {
  mg_common_hello: 'mg_common_hello', // 测试状态
  mg_common_init_game: 'mg_common_init_game', // 游戏初始化
  mg_common_exit_game: 'mg_common_exit_game', // 退出游戏
  mg_common_self_click_join_btn: 'mg_common_self_click_join_btn', // 加入游戏状态
  mg_common_self_click_start_btn: 'mg_common_self_click_start_btn', // 开始游戏按钮点击
  mg_common_game_state: 'mg_common_game_state', // 游戏状态变更
  mg_common_game_settle: 'mg_common_game_settle', // 游戏结算状态
  mg_common_player_in: 'mg_common_player_in', // 玩家加入
  mg_common_player_ready: 'mg_common_player_ready', // 准备状态
  mg_common_player_captain: 'mg_common_player_captain', // 队长状态
  mg_common_self_click_game_player_avatar: 'mg_common_self_click_game_player_avatar', // 点击玩家头像
  mg_common_log: 'mg_common_log', // 日志
  mg_common_view_info: 'mg_common_view_info', // 游戏尺寸信息
  mg_customer_hello: 'mg_customer_hello', // 自定义事件 测试
}

// 通用状态key（H5事件推送）
export const SDK_MSG_STATE_H5 = {
  h5_common_hello: 'h5_common_hello', // 测试状态
  h5_common_load_game: 'h5_common_load_game', // 加载游戏
  h5_common_join_game: 'h5_common_join_game', // 加入游戏
  h5_common_destroy_game: 'h5_common_destroy_game', // 销毁游戏
  h5_common_game_setting_select_info: 'h5_common_game_setting_select_info', // 设置游戏玩法信息
}
