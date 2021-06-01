import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMusicListDetail, getAlbumInfo } from '../../api';
import qs from 'qs';
import styles from './style.scss';

import { Typography, Image } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import {
  getSongAction,
  getCollectAction,
  getPlayAction,
} from '../../store/actionCreator';

import TableList from '../../components/TableList';
export default memo(function ListInfo(props) {
  const dispatch = useDispatch();
  const isAblum = props.isAblum;
  const { Paragraph } = Typography;
  const { id } = qs.parse(props.searchParams.substring(1));
  const [detailData, setDetailData] = useState({});
  const [songId, setSongId] = useState(null);
  const [isCollectd, seIsCollectd] = useState(false);
  const isLoading = useSelector(
    (state) => state.get('isLoading'),
    shallowEqual
  );
  const { collectSongList } = useSelector((state) => state.get('collector'));
  useEffect(async () => {
    if (isAblum) {
      let ablumData = await getAlbumInfo(id);
      setDetailData(ablumData);
    } else {
      let { playlist = {} } = await getMusicListDetail(id);
      setDetailData(playlist);
    }
  }, []);
  useEffect(() => {
    if (songId) {
      dispatch(getSongAction(songId));
    }
  }, [songId]);
  useEffect(() => {
    const index = collectSongList.findIndex(
      (item) => item.id === detailData.id
    );
    if (index !== -1) {
      seIsCollectd(true);
    } else {
      seIsCollectd(false);
    }
  }, [collectSongList, detailData]);
  return (
    !isLoading && (
      <div className={styles.listInfo}>
        <div className={styles.sub}>
          <Image
            preview={false}
            src={
              detailData.coverImgUrl ||
              (detailData.album && detailData.album.picUrl)
            }
            alt=""
          />
          <p className={styles.title}>
            {detailData.name || (detailData.album && detailData.album.name)}
          </p>
          <Paragraph
            className={styles.desc}
            ellipsis={{ rows: 10, expandable: false, symbol: 'more' }}
          >
            {detailData.description}
          </Paragraph>
          <div className={styles.control}>
            <i
              title="播放歌单音乐"
              className="iconfont icon-play1"
              onClick={() => {
                const songsList = detailData.tracks || detailData.songs;
                const songsListMap = songsList.map((item) => {
                  return {
                    id: item.id,
                    name: item.name,
                    artists: item.ar || item.artists,
                    album: item.al || item.album,
                  };
                });
                setSongId(songsList[0].id);
                dispatch(getPlayAction(songsListMap));
              }}
            ></i>
            <i
              style={{ color: isCollectd ? '#f92e58' : '' }}
              className="iconfont icon-folder"
              title={isCollectd ? '取消收藏此歌单' : '收藏此歌单'}
              onClick={() => {
                const songsList = detailData.tracks || detailData.songs;
                const songsListMap = songsList.map((item) => {
                  return {
                    id: item.id,
                    name: item.name,
                    artists: item.ar || item.artists,
                    album: item.al || item.album,
                  };
                });
                dispatch(
                  getCollectAction(
                    {
                      name:
                        detailData.name ||
                        (detailData.album && detailData.album.name),
                      id: detailData.id,
                      imgUrl:
                        detailData.coverImgUrl ||
                        (detailData.album && detailData.album.picUrl),
                      songList: songsListMap,
                    },
                    {
                      isSongList: true,
                      isAdd: !isCollectd,
                    }
                  )
                );
              }}
            ></i>
          </div>
        </div>
        <div className={styles.info}>
          <TableList tableData={detailData.tracks || detailData.songs || []} />
        </div>
      </div>
    )
  );
});
