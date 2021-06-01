import * as actionTypes from './actionTypes';
import { getMusicDetail, getMusicLyric, getMusicUrl } from '../api';
import $db from '../data';

function getSongUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}
export const changeSongAction = (currentSong) => ({
  type: actionTypes.CHANGE_PLAY_STATUS,
  currentSong,
});
const changeLyricAction = (currentLyric) => ({
  type: actionTypes.CHANGE_LYRIC,
  currentLyric,
});
export const changeCollectorAction = (collector) => ({
  type: actionTypes.CHANGE_COLLECTOR,
  collector,
});
const changePlayListAction = (playList) => ({
  type: actionTypes.CHANGE_PLAYLIST,
  playList,
});
const changeCurrentSongAction = (currentSong) => ({
  type: actionTypes.CHANGE_CURRENT_SONG,
  currentSong,
});

export const changeLoadingAction = (res) => ({
  type: actionTypes.CHANGE_LOADING_STATUS,
  isLoading: res.isLoading,
});
/**
 * 歌词取时间和文本
 */
export const getLyricAction = (id) => {
  return async (dispatch) => {
    const data = await getMusicLyric(id);
    const lyricSplit = data && data.lrc && data.lrc.lyric.split(/[\n]/);
    let lyricMap = [];
    lyricSplit
      .filter((item) => item !== '')
      .map((item) => {
        const temp = item.split(']');
        const text = temp.pop();
        temp.map((info) => {
          const time_arr = info.substring(1).split(':');
          const time = Number(time_arr[0] * 60) + Number(time_arr[1]);
          lyricMap.push({
            time: time,
            lyc: text,
          });
        });
      });
    const lyricList = lyricMap.sort((a, b) => a.time - b.time);
    dispatch(changeLyricAction(lyricList));
  };
};
export const getSongAction = (id) => {
  if (!id) return;
  return async (dispatch) => {
    const { data } = await getMusicUrl(id);
    const res = await getMusicDetail(id);
    const song = res && res.songs && res.songs[0];
    let currentSong = {
      id: song.id,
      name: song.name,
      imgUrl: song.al && song.al.picUrl,
      artists: song.ar || song.artists,
      album: song.al || song.album,
    };
    if (data && data[0] && data[0].url && data[0].url !== '') {
      currentSong = { ...currentSong, ...{ musicUrl: data[0].url } };
    } else {
      currentSong = { ...currentSong, ...{ musicUrl: getSongUrl(song.id) } };
    }
    $db.update({ name: 'play' }, { $set: { currentSong: currentSong } }, () => {
      dispatch(changeSongAction(currentSong));
    });
  };
};

/**
 * 获取收藏、喜欢
 */
export const getCollectAction = (song, params = {}) => {
  console.log('params.isAdd :>> ', song, params);
  return (dispatch) => {
    let collector = null;
    $db.find({ name: 'collector' }, (err, res) => {
      collector = res[0];
      const loveIndex = collector.loveList.findIndex(
        (item) => item.id === song.id
      );
      const ListIndex = collector.collectSongList.findIndex(
        (item) => item.id === song.id
      );
      if (params.isSongList) {
        if (params.isAdd && ListIndex === -1) {
          collector.collectSongList.push(song);
        } else {
          collector.collectSongList.splice(ListIndex, 1);
        }
        $db.update(
          { name: 'collector' },
          { $set: { collectSongList: collector.collectSongList } },
          () => {
            dispatch(changeCollectorAction(collector));
          }
        );
      } else {
        if (params.isAdd) {
          collector.loveList.push(song);
        } else {
          collector.loveList.splice(loveIndex, 1);
        }
        $db.update(
          { name: 'collector' },
          { $set: { loveList: collector.loveList } },
          () => {
            dispatch(changeCollectorAction(collector));
          }
        );
      }
    });
  };
};
/**
 * 获取播放列表以及当前播放歌曲
 */
export const getPlayAction = (playList) => {
  console.log('playList getPlayAction:>> ', playList);
  return (dispatch) => {
    $db.update({ name: 'play' }, { $set: { playList: playList } }, () => {
      dispatch(changePlayListAction(playList));
    });
  };
};
