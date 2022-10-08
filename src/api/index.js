import axios from 'axios';
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3000';
} else {
  axios.defaults.baseURL = 'http://81.68.141.185:3000';
}
import store from '../store';
import * as actionTypes from '../store/actionTypes';

import { message } from 'antd';
function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res) => {
        if (res) {
          resolve(res.data); // 成功
        }
      })
      .catch((err) => {
        message.error({
          content: '请求发生了一个小错误，请稍后重试',
          className: 'message-error-class',
        });
        reject(err); //失败
      });
  });
}
async function getData(url) {
  await store.dispatch({
    type: actionTypes.CHANGE_LOADING_STATUS,
    isLoading: true,
  });
  let data = await get(url);
  await store.dispatch({
    type: actionTypes.CHANGE_LOADING_STATUS,
    isLoading: false,
  });
  return data;
}
// 获取推荐歌单
export function getRecommendList(updateTime = null) {
  let url = '';
  if (updateTime) {
    url = `/top/playlist/highquality?before=${updateTime}&limit=30`;
  } else {
    url = '/top/playlist/highquality?limit=30';
  }
  return getData(url);
}

// 获取歌单详情
export function getMusicListDetail(id) {
  const url = `/playlist/detail?id=${id}`;
  return getData(url);
}

// 获取音乐播放地址
export async function getMusicUrl(id) {
  const url = `/song/url?id=${id}`;
  const data = await get(url);
  return data;
}

// 获取音乐详情（歌曲没有图片的时候要用）
export async function getMusicDetail(id) {
  const url = `/song/detail?ids=${id}`;
  const data = await get(url);
  return data;
}

// 获取歌曲歌词
export async function getMusicLyric(id) {
  const url = `/lyric?id=${id}`;
  const data = await get(url);
  return data;
}

// 获取歌手单曲
export function getSingerInfo(id) {
  const url = `/artists?id=${id}`;
  return getData(url);
}

// 获取歌手专辑
export function getSingerAlbums(id) {
  const url = `/artist/album?id=${id}`;
  return getData(url);
}

// 获取专辑详情
export function getAlbumInfo(id) {
  const url = `/album?id=${id}`;
  return getData(url);
}

/**
 * 获取排行榜所有榜单
 */
export function getAllRank() {
  const url = '/toplist';
  return getData(url);
}

export const getHotSearch = () => {
  const url = '/search/hot';
  return getData(url);
};

export const getSearchResult = (searchName, type) => {
  const url = `/search?keywords=${searchName}&type=${type}&limit=80`;
  return getData(url);
};
