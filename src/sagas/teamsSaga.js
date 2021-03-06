import { put, fork, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { NavigationActions } from 'react-navigation'
import { Toast } from 'antd-mobile'
import {
  POST_TEAMS_REQUEST,
  PUT_TEAMS_REQUEST,
  DELETE_TEAM_MEMBER_REQUEST,
  DELETE_TEAM_REQUEST,
  GET_HOME_TEAM_LIST_REQUEST,
  GET_HOME_TEAM_DETAIL_REQUEST,
  GET_MY_TEAMS_REQUEST,
  GET_IN_TEAMS_REQUEST
} from '../constants/actionTypes'
import * as action from '../actions'
import { teamsService, userService } from '../services/leanclound'

function* postTeamsWorker(payload) {
  try {
    Toast.loading('提交中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const team = yield call(teamsService.getMyTeams, currentUser)
    if (team.length < currentUser.get('teamLimit')) {
      const response = yield call(teamsService.cerateTeam, payload, currentUser)
      yield put(action.postTeamsSuccess(response))
      Toast.success('提交成功', 1)
      yield delay(1000)
      yield put(NavigationActions.back())
    } else {
      yield put(action.postTeamsFailed())
      Toast.fail(
        '提交失败，每位用户最多可创建一支战队，若想创建多支战队，请联系管理员963577494@qq.com',
        3
      )
    }
  } catch (error) {
    yield put(action.postTeamsFailed())
    Toast.fail('提交失败', 1)
  }
}

function* putTeamsWorker(payload) {
  try {
    Toast.loading('提交中')
    const response = yield call(teamsService.updateTeam, payload)
    yield put(action.putTeamsSuccess(response))
    Toast.success('提交成功', 1)
    yield delay(1000)
    yield put(NavigationActions.back())
  } catch (error) {
    yield put(action.putTeamsFailed())
    Toast.fail('提交失败', 1)
  }
}

function* getInTeamsWorker() {
  try {
    Toast.loading('加载中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const response = yield call(teamsService.getInTeams, currentUser)
    yield put(action.getInTeamsSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getInTeamsFailed(error))
    Toast.hide()
  }
}

function* getMyTeamsWorker() {
  try {
    Toast.loading('加载中')
    const currentUser = yield call(userService.getCurrentUserAsync)
    const response = yield call(teamsService.getMyTeams, currentUser)
    yield put(action.getMyTeamsSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getMyTeamsFailed(error))
    Toast.hide()
  }
}

function* deleteTeamMemberWorker(payload) {
  try {
    Toast.loading('提交中')
    const response = yield call(teamsService.removeMember, payload)
    yield put(action.deleteTeamMemberSuccess(response))
    Toast.success('移除队员成功', 1.5)
    yield delay(1500)
    yield put(NavigationActions.back())
  } catch (error) {
    yield put(action.deleteTeamMemberFailed(error))
    Toast.fail(error.message, 1.5)
  }
}

function* deleteTeamWorker(payload) {
  try {
    Toast.loading('提交中')
    const response = yield call(teamsService.removeTeam, payload)
    yield put(action.deleteTeamSuccess(response))
    Toast.success('解散队伍成功', 1.5)
    yield delay(1500)
  } catch (error) {
    yield put(action.deleteTeamFailed(error))
    Toast.fail(error.message, 1.5)
  }
}

function* getHomeTeamListWorker(payload) {
  try {
    Toast.loading('加载中')
    const response = yield call(teamsService.getHomeTeamsList, payload)
    yield put(action.getHomeTeamListSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getHomeTeamListFailed(error))
    Toast.hide()
  }
}

function* getHomeTeamDetailWorker(payload) {
  try {
    Toast.loading('加载中')
    const response = yield call(teamsService.getHomeTeamDetail, payload)
    yield put(action.getHomeTeamDetailSuccess(response))
    Toast.hide()
  } catch (error) {
    yield put(action.getHomeTeamDetailFailed(error))
    Toast.hide()
  }
}

function* watchPostTeams() {
  while (true) {
    const { payload } = yield take(POST_TEAMS_REQUEST)
    yield fork(postTeamsWorker, payload)
  }
}

function* watchPutTeams() {
  while (true) {
    const { payload } = yield take(PUT_TEAMS_REQUEST)
    yield fork(putTeamsWorker, payload)
  }
}

function* watchDeleteTeamMember() {
  while (true) {
    const { payload } = yield take(DELETE_TEAM_MEMBER_REQUEST)
    yield fork(deleteTeamMemberWorker, payload)
  }
}

function* watchDeleteTeam() {
  while (true) {
    const { payload } = yield take(DELETE_TEAM_REQUEST)
    yield fork(deleteTeamWorker, payload)
  }
}

function* watchGetHomeTeamList() {
  while (true) {
    const { payload } = yield take(GET_HOME_TEAM_LIST_REQUEST)
    yield fork(getHomeTeamListWorker, payload)
  }
}

function* watchGetHomeTeamDetail() {
  while (true) {
    const { payload } = yield take(GET_HOME_TEAM_DETAIL_REQUEST)
    yield fork(getHomeTeamDetailWorker, payload)
  }
}

function* watchGetMyTeams() {
  while (true) {
    yield take(GET_MY_TEAMS_REQUEST)
    yield fork(getMyTeamsWorker)
  }
}

function* watchGetInTeams() {
  while (true) {
    yield take(GET_IN_TEAMS_REQUEST)
    yield fork(getInTeamsWorker)
  }
}

export {
  watchPostTeams,
  watchPutTeams,
  watchDeleteTeamMember,
  watchDeleteTeam,
  watchGetHomeTeamList,
  watchGetHomeTeamDetail,
  watchGetMyTeams,
  watchGetInTeams
}
