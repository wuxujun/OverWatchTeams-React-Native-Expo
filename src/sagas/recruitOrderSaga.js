import { put, fork, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { Toast } from 'antd-mobile'
import { NavigationActions } from 'react-navigation'
import {
  GET_HOME_RECRUIT_ORDER_LIST_REQUEST,
  GET_ACCOUNT_RECRUIT_ORDER_LIST_REQUEST,
  POST_RECRUIT_ORDER_REQUEST,
  PUT_RECRUIT_ORDER_REQUEST,
  DELETE_RECRUIT_ORDER_REQUEST
} from '../constants/actionTypes'
import * as action from '../actions'
import {
  recruitOrderService,
  teamsService,
  userService
} from '../services/leanclound'

function* postRecruitOrderWorker(payload) {
  try {
    Toast.loading('提交中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const userinfo = yield call(userService.getUserInfoToJson, currentUser)
    const count = yield call(
      recruitOrderService.getRecruitOrderCountOfToday,
      currentUser
    )
    const recruitOrderLimit = userinfo.recruitOrderLimit
    if (count < recruitOrderLimit) {
      const team = yield call(teamsService.getTeamToJson, payload)
      const response = yield call(
        recruitOrderService.cerateRecruitOrder,
        payload,
        team,
        currentUser
      )
      yield put(action.postRecruitOrderSuccess(response))
      Toast.success('提交成功', 1)
      yield delay(1000)
      yield put(NavigationActions.back())
    } else {
      yield put(action.postRecruitOrderFailed())
      Toast.fail(`1天最多发布${recruitOrderLimit}条战队招募令`, 2)
      yield delay(2000)
      yield put(NavigationActions.back())
    }
  } catch (error) {
    yield put(action.postRecruitOrderFailed(error))
    Toast.fail('提交失败', 1)
  }
}

function* putRecruitOrderWorker(payload) {
  try {
    Toast.loading('提交中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const team = yield call(teamsService.getTeam, payload)
    const response = yield call(
      recruitOrderService.updateRecruitOrder,
      payload,
      team
    )
    yield put(action.putRecruitOrderSuccess(response))
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(NavigationActions.back())
  } catch (error) {
    yield put(action.putRecruitOrderFailed(error))
    Toast.fail('提交失败', 1)
  }
}

function* deleteRecruitOrderWorker(payload) {
  try {
    Toast.loading('提交中')
    const response = yield call(recruitOrderService.removeRecruitOrder, payload)
    yield put(action.deleteRecruitOrderSuccess(response))
    Toast.success('删除成功', 1)
  } catch (error) {
    yield put(action.deleteRecruitOrderFailed(error))
    Toast.fail('删除失败', 1)
  }
}

function* getAccountRecruitOrderListWorker(payload) {
  try {
    Toast.loading('加载中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const response = yield call(
      recruitOrderService.getAccountRecruitOrderList,
      payload,
      currentUser
    )
    yield put(action.getAccountRecruitOrderListSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getAccountRecruitOrderListFailed(error))
    Toast.hide()
  }
}

function* getHomeRecruitOrderListWorker(payload) {
  try {
    Toast.loading('加载中')
    const response = yield call(
      recruitOrderService.getHomeRecruitOrderList,
      payload
    )
    yield put(action.getHomeRecruitOrderListSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getHomeRecruitOrderListFailed(error))
    Toast.hide()
  }
}

function* watchPostRecruitOrder() {
  while (true) {
    const { payload } = yield take(POST_RECRUIT_ORDER_REQUEST)
    yield fork(postRecruitOrderWorker, payload)
  }
}

function* watchGetAccountRecruitOrderList() {
  while (true) {
    const { payload } = yield take(GET_ACCOUNT_RECRUIT_ORDER_LIST_REQUEST)
    yield fork(getAccountRecruitOrderListWorker, payload)
  }
}

function* watchGetHomeRecruitOrderList() {
  while (true) {
    const { payload } = yield take(GET_HOME_RECRUIT_ORDER_LIST_REQUEST)
    yield fork(getHomeRecruitOrderListWorker, payload)
  }
}

function* watchPutRecruitOrder() {
  while (true) {
    const { payload } = yield take(PUT_RECRUIT_ORDER_REQUEST)
    yield fork(putRecruitOrderWorker, payload)
  }
}

function* watchDeleteRecruitOrder() {
  while (true) {
    const { payload } = yield take(DELETE_RECRUIT_ORDER_REQUEST)
    yield fork(deleteRecruitOrderWorker, payload)
  }
}

export {
  watchGetHomeRecruitOrderList,
  watchPostRecruitOrder,
  watchGetAccountRecruitOrderList,
  watchPutRecruitOrder,
  watchDeleteRecruitOrder
}
