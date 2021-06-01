import styles from './style.scss';
import React, { memo, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Image, List } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { getMusicDetail, getMusicLyric } from '../../api';
import {
  getLyricAction,
  getCollectAction,
  getPlayAction,
  getSongAction,
} from '../../store/actionCreator';
import Progress from './Progress';
import moment from 'moment';
import $db from '../../data';
import TableList from '../../components/TableList';

export default memo(function Player() {
  const [isPlay, setIsPlay] = useState(false);
  const [audio, setAudio] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volumeWidth, setvolumeWidth] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showLyric, setShowLyric] = useState(false);
  const [showLyricBoard, setShowLyricBoard] = useState(false);
  const [currentLyric, setCurrentLyric] = useState({ index: 0 });
  const [isLoveSong, setIsLoveSong] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [isOpenListDrawer, setIsOpenListDrawer] = useState(false);
  const [playStatus, setPlayStatus] = useState({
    icon: 'next',
    name: '列表循环',
  });
  const [playData, setPlayData] = useState([]);
  const audioRef = useRef(null);
  const scrollBox = useRef(null);
  const playListBox = useRef(null);
  const dispatch = useDispatch();
  const currentSong = useSelector((state) => state.get('currentSong'));
  const lyricList = useSelector((state) => state.get('currentLyric'));
  const { loveList } = useSelector((state) => state.get('collector'));
  const playList = useSelector((state) => state.get('playList'));
  useEffect(() => {
    audioRef.current.load();
    setAudio(audioRef.current);
    setvolumeWidth(0.2);
  }, []);
  useEffect(() => {
    dispatch(getLyricAction(currentSong.id));
  }, [currentSong]);
  useEffect(() => {
    setIsOpenListDrawer(isOpenList);
  }, [isOpenList]);
  useEffect(() => {
    const index = loveList.findIndex((item) => item.id === currentSong.id);
    if (index !== -1) {
      setIsLoveSong(true);
    } else {
      setIsLoveSong(false);
    }
  }, [loveList, currentSong]);
  useEffect(() => {
    if (isOpenList) {
      const songIndex = playData.findIndex(
        (item) => item.id === currentSong.id
      );
      setTimeout(() => {
        if (playListBox.current && songIndex !== -1) {
          playListBox.current.scrollTo(0, 54.6 * (songIndex + 1) - 60);
        }
      }, 300);
    }
  }, [isOpenList, currentSong]);
  useEffect(() => {
    if (isOpenList) {
      document.addEventListener('click', handleOpenList);
    } else {
      document.removeEventListener('click', handleOpenList);
    }
    return () => {
      document.removeEventListener('click', handleOpenList);
    };
  }, [isOpenList]);
  useEffect(() => {
    setPlayData(playList);
  }, [playList]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownLove);
    return () => {
      document.removeEventListener('keydown', handleKeyDownLove);
    };
  }, [isLoveSong]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownShowLyric);
    return () => {
      document.removeEventListener('keydown', handleKeyDownShowLyric);
    };
  }, [showLyricBoard]);

  const getPcType = (e) => {
    const platform = process && process.platform;
    if (!platform) return;
    let command = e.ctrlKey;
    if (platform === 'darwin') {
      command = e.metaKey;
    } else if (platform === 'win32') {
      command = e.ctrlKey;
    }
    return command;
  };
  const handleKeyDown = (e) => {
    const command = getPcType(e);
    if (e.keyCode === 32 || (command && e.keyCode === 80)) {
      e.preventDefault();
      setIsPlay(audio.paused);
      audio.paused ? audio.play() : audio.pause();
    }
    if (command && e.keyCode === 37) {
      e.preventDefault();

      handleChangeSong(-1);
    }
    if (command && e.keyCode === 39) {
      e.preventDefault();

      handleChangeSong(1);
    }
    if (command && e.keyCode === 38) {
      e.preventDefault();

      volumeProgressClick(Number(audio.volume) + 0.05);
    }
    if (command && e.keyCode === 40) {
      e.preventDefault();

      volumeProgressClick(Number(audio.volume - 0.05));
    }
  };
  const handleKeyDownLove = (e) => {
    const command = getPcType(e);
    if (command && e.keyCode === 76) {
      dispatch(
        getCollectAction(currentSong, {
          isSongList: false,
          isAdd: !isLoveSong,
        })
      );
    }
  };
  const handleKeyDownShowLyric = (e) => {
    const command = getPcType(e);
    if (command && e.keyCode === 68) {
      setShowLyricBoard(!showLyricBoard);
    }
  };
  const momentTime = (time) => {
    const timeFloor = Math.floor(time || 0);
    return moment.unix(timeFloor).format('mm:ss');
  };
  const PlayEnd = () => {
    setIsPlay(false);
    if (playStatus.icon === 'loop') {
      audio.currentTime = 0;
      audio.play();
    } else {
      handleChangeSong(1);
    }
  };
  const progressClick = (width, offsetWidth, type) => {
    audio.currentTime = audioDuration * width;
    if (type && type === 'up') {
      audio.play();
    }
    if (type && type === 'move') {
      audio.pause();
    }
  };
  const volumeProgressClick = (width) => {
    let regionWidth = 0.2;
    if (width > 1) {
      regionWidth = 1;
    } else if (width < 0) {
      regionWidth = 0;
    } else {
      regionWidth = width;
    }
    audio.volume = regionWidth;
    setvolumeWidth(regionWidth);
  };
  const timeupdate = (e) => {
    setCurrentTime(audio.currentTime);
    if (
      lyricList.length > 0 &&
      audio.currentTime > lyricList[lyricList.length - 1].time
    ) {
      setCurrentLyric({
        index: lyricList.length - 1,
        lyc: lyricList[lyricList.length - 1].lyc,
      });
    }
    if (audio.currentTime === 0) {
      setCurrentLyric({ index: 0, lyc: lyricList[0] ? lyricList[0].lyc : '' });
    } else {
      lyricList.map((item, i, arr) => {
        if (
          arr[i + 1] &&
          audio.currentTime <= arr[i + 1].time &&
          audio.currentTime >= arr[i].time
        ) {
          setCurrentLyric({ index: i, lyc: item.lyc });
          // scrollBox.scrollTo(0, currentLyric.index * 38);
          if (document.querySelector('#scrollBox')) {
            document.querySelector('#scrollBox').scrollTo({
              left: 0,
              top: currentLyric.index * 38,
              behavior: 'smooth',
            });
          }
        }
      });
    }
  };
  const handleShowLyric = () => {
    setShowLyric(!showLyric);
  };
  const handleOpenList = (event) => {
    setIsOpenList(false);
  };
  const handleChangeSong = (flag, e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const songIndex = playData.findIndex((item) => item.id === currentSong.id);
    let playIndex = 0;

    if (playStatus.icon === 'random') {
      playIndex = Math.floor(Math.random() * (playData.length - 1));
    } else {
      if (songIndex === -1) {
        playIndex = 0;
      } else {
        const length = Number(playData.length);
        if (flag === -1 && songIndex === 0) {
          playIndex = length - 1;
        } else if (flag === 1 && songIndex === length - 1) {
          playIndex = 0;
        } else {
          playIndex = Number(songIndex) + Number(flag);
        }
      }
    }
    dispatch(getSongAction(playData[playIndex].id));
  };

  return (
    <div className={styles.player}>
      <div className={styles.playBtns}>
        <i
          className="iconfont icon-prev"
          onClick={(e) => {
            handleChangeSong(-1, e);
          }}
        />
        <i
          className={`iconfont icon-${isPlay ? 'stop' : 'bofangicon'}`}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (isPlay) {
              setIsPlay(false);
              audio.pause();
            } else {
              setIsPlay(true);
              audio.play();
            }
          }}
        />
        <i
          className="iconfont icon-test"
          onClick={(e) => {
            handleChangeSong(1, e);
          }}
        />
      </div>
      <div className={styles.imgBox}>
        <img src={currentSong.imgUrl} alt="" className={styles.userImg} />
        <div
          onClick={handleShowLyric}
          className={styles.hoverBg}
          title="查看歌词"
        >
          {showLyric ? (
            <DownOutlined className={styles.upIcon} />
          ) : (
            <UpOutlined className={styles.upIcon} />
          )}
        </div>
      </div>
      <div className={styles['play-progress']}>
        <div className={styles.title}>
          <span className={styles.lyricMin}>{currentSong.name}</span>
          <span className={styles.songer}>
            {currentSong.artists && currentSong.artists[0].name}
          </span>
        </div>
        <div className={styles['progress-info']}>
          <Progress
            progressClick={progressClick}
            width={(currentTime / audioDuration) * 100}
          />
          <div className={styles.time}>
            <span>{momentTime(currentTime)}</span>/
            <span>{momentTime(audioDuration)}</span>
          </div>
          <div className={styles.audio}>
            <i
              style={{ color: muted ? '#504b4b' : '#ebebeb' }}
              onClick={() => {
                setMuted(!muted);
              }}
              className="iconfont icon-volume-up"
            />
            <Progress
              width={volumeWidth * 100}
              progressClick={volumeProgressClick}
            />
          </div>
        </div>
      </div>
      <div className={styles['control-btns']}>
        <span
          style={{ color: showLyricBoard ? '#f92e58' : '#9e9e9e' }}
          onClick={() => {
            setShowLyricBoard(!showLyricBoard);
          }}
        >
          词
        </span>
        <i
          className={`iconfont ${isLoveSong ? 'icon-love' : 'icon-will-love'}`}
          title={isLoveSong ? '不喜欢这首歌啦' : '添加到我喜欢的音乐'}
          onClick={() => {
            setIsLoveSong(!isLoveSong);
            dispatch(
              getCollectAction(currentSong, {
                isSongList: false,
                isAdd: !isLoveSong,
              })
            );
          }}
        ></i>
        <i
          className={`iconfont icon-${playStatus.icon}`}
          title={playStatus.name}
          onClick={() => {
            if (playStatus.icon === 'loop') {
              setPlayStatus({ icon: 'next', name: '列表循环' });
            } else if (playStatus.icon === 'next') {
              setPlayStatus({ icon: 'random', name: '随机播放' });
            } else {
              setPlayStatus({ icon: 'loop', name: '单曲循环' });
            }
          }}
        ></i>
        <i
          className="iconfont icon-list"
          title={isOpenList ? '关闭播放列表' : '打开播放列表'}
          onClick={() => {
            setIsOpenList(!isOpenList);
          }}
        ></i>
      </div>
      <audio
        id="audioPlay"
        muted={muted}
        autoPlay={currentSong.id !== 167850}
        src={currentSong && currentSong.musicUrl}
        ref={audioRef}
        onCanPlay={() => {
          console.log(`CanPlay`);
          let audioPlay = document.querySelector('#audioPlay');
          setAudioDuration(audioPlay.duration);
          setIsPlay(!audioPlay.paused);
          // setAudioDuration(audioRef.current.duration);
        }}
        onEnded={PlayEnd}
        onTimeUpdate={timeupdate}
      ></audio>
      <Drawer
        title="Basic Drawer"
        placement="bottom"
        bodyStyle={{ background: 'rgb(15, 29, 39)' }}
        headerStyle={{
          display: 'none',
        }}
        maskClosable={false}
        visible={showLyric}
        height="100vh"
        closeIcon={<DownOutlined size={24} />}
        key={'showLyric'}
        onClose={() => setShowLyric(false)}
      >
        <div className={styles.drawerInfo}>
          <DownOutlined
            className={styles.closeDrawer}
            onClick={() => setShowLyric(false)}
          />
          <Image
            preview={false}
            src={currentSong.imgUrl}
            className={styles.userImg}
          />
          <div className={styles['right-info']}>
            <div className={styles.title}>
              <h1>{currentSong.name}</h1>
              <span>{currentSong.artists && currentSong.artists[0].name}</span>
            </div>
            <div id="scrollBox" ref={scrollBox} className={styles.lyricList}>
              <div
                className={styles.lyricListInfo}
                // style={{
                //   transform: `translateY(-${currentLyric.index * 38}px)`,
                // }}
              >
                {lyricList.length > 0
                  ? lyricList.map((item, i) => {
                      return (
                        <p
                          style={{ overflow: 'hidden' }}
                          className={
                            currentLyric.index === i ? styles.currentLyric : ''
                          }
                          key={i}
                        >
                          {item && item.lyc}
                        </p>
                      );
                    })
                  : '暂无歌词'}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <Drawer
        className={styles.playListDrawer}
        key={'isOpenList'}
        visible={isOpenListDrawer}
        placement="right"
        width="350px"
        zIndex={2000}
        closable={false}
        mask={false}
        bodyStyle={{ background: 'rgb(15, 29, 39)', padding: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {playData && playData.length > 0 ? (
          <div className={styles.playList}>
            <div className={styles.playListHead}>
              <span>总{playData && playData.length}首</span>
              <span
                onClick={() => {
                  dispatch(getPlayAction([]));
                }}
              >
                清空
              </span>
            </div>
            <div className={styles.tableBox} ref={playListBox}>
              <TableList
                noShowHeader
                simple
                tableData={playData || []}
                currentSongId={currentSong.id}
              />
            </div>
          </div>
        ) : (
          <p className={styles.noData}>你还没添加歌曲！</p>
        )}
      </Drawer>
      {showLyricBoard && (
        <div className={styles.lryicBoard}>
          {currentLyric.lyc || '暂无歌词'}
        </div>
      )}
    </div>
  );
});
