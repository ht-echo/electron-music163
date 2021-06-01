import * as actionTypes from './actionTypes';
import { Map } from 'immutable';

// 给一个初始的 state
const defaultState = Map({
  isLoading: false,
  currentLyric: [],
  currentSong: {
    id: 167850,
    name: '庐州月',
    imgUrl:
      'https://p2.music.126.net/3hqcQrXZ39kDCCzV7QbZjA==/34084860473122.jpg',
    musicUrl: 'https://music.163.com/song/media/outer/url?id=167850.mp3',
    artists: [
      {
        id: 5771,
        name: '许嵩',
      },
    ],
    album: {
      id: 16951,
      name: '寻雾启示',
    },
  },
  // 收藏
  collector: {
    loveList: [],
    collectSongList: [],
  },
  playList: [],
});

// state 里面存放了所有的数据
// reducer 可以接收 state，但是绝对不可以修改 state
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_LOADING_STATUS:
      return state.set('isLoading', action.isLoading);
    case actionTypes.CHANGE_PLAY_STATUS:
      return state.set('currentSong', action.currentSong);
    case actionTypes.CHANGE_LYRIC:
      return state.set('currentLyric', action.currentLyric);
    case actionTypes.CHANGE_COLLECTOR:
      return state.set('collector', action.collector);
    case actionTypes.CHANGE_PLAYLIST:
      return state.set('playList', action.playList);

    default:
      return state;
  }
};
