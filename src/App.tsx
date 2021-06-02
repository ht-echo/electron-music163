import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import {
  changeCollectorAction,
  getPlayAction,
  changeSongAction,
} from './store/actionCreator';
import $db from './data';

import { Spin } from 'antd';
import './App.global.scss';
import Recommend from './views/Recommend';
import Ranking from './views/Ranking';
import Search from './views/Search';
import Collect from './views/Collect';
import About from './views/About';
import PlayList from './views/PlayList';
import SingerInfo from './views/SingerInfo';
import AblumInfo from './views/AblumInfo';
import RankInfo from './views/RankInfo';
import MyHeader from './components/MyHeader';
import Player from './components/Player';
export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state) => state.get('isLoading'),
    shallowEqual
  );
  useEffect(() => {
    $db.find({ name: 'collector' }, (err, res) => {
      console.log('res collector:>> ', res);
      if (res.length === 0) {
        $db.insert(
          {
            name: 'collector',
            loveList: [],
            collectSongList: [],
          },
          (err, res) => {
            handleChangeCollector(res[0]);
          }
        );
      } else {
        handleChangeCollector(res[0]);
      }
    });
    // 初始化使用信息
    $db.find({ name: 'play' }, (err, res) => {
      console.log('play res :>> ', res);
      if (res.length === 0) {
        $db.insert({
          name: 'play',
          playList: [],
          history: [],
          currentSong: {
            id: 167850,
            name: '庐州月',
            imgUrl:
              'https://p2.music.126.net/3hqcQrXZ39kDCCzV7QbZjA==/34084860473122.jpg',
            musicUrl:
              'https://music.163.com/song/media/outer/url?id=167850.mp3',
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
        }),
          (err, res) => {
            handleChangePlay(res[0]);
          };
      } else {
        handleChangePlay(res[0]);
      }
    });
  }, []);
  const handleChangeCollector = (value) => {
    dispatch(changeCollectorAction(value));
  };
  const handleChangePlay = (value) => {
    dispatch(getPlayAction(value.playList));
    dispatch(changeSongAction(value.currentSong));
  };
  return (
    <div id="app">
      <Router>
        <MyHeader />
        <Player />
        <div className="app-spinBox">
          <Spin spinning={isLoading} size="large">
            <Switch>
              <Route path="/" exact component={Recommend} />
              <Route path="/ranking" component={Ranking} />
              <Route path="/search" component={Search} />
              <Route path="/collect" component={Collect} />
              <Route path="/about" component={About} />
              <Route path="/playlist" component={PlayList} />
              <Route path="/singerInfo" component={SingerInfo} />
              <Route path="/ablumInfo" component={AblumInfo} />
              <Route path="/rankInfo" component={RankInfo} />
              <Redirect to="/" />
            </Switch>
          </Spin>
        </div>
      </Router>
    </div>
  );
}
