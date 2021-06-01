import { Table, Typography, Image } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getSongAction,
  getCollectAction,
  getPlayAction,
} from '../../store/actionCreator';
import $db from '../../data';

import styles from './style.scss';
export default memo(function TableList(props) {
  const { simple = false } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoading = useSelector(
    (state) => state.get('isLoading'),
    shallowEqual
  );

  const { loveList } = useSelector(
    (state) => state.get('collector'),
    shallowEqual
  );
  const tableDataProps = props.tableData || props.searchData;
  const [isLoveList, setIsLoveList] = useState([]);
  const [songId, setSongId] = useState(null);
  useEffect(() => {
    let isLoveListMap = tableDataProps.map((item) => false);
    tableDataProps.map((item, index) => {
      loveList.map((info) => {
        if (item.id === info.id) {
          isLoveListMap[index] = true;
        }
      });
    });
    setIsLoveList([...isLoveListMap]);
  }, [tableDataProps, loveList]);
  useEffect(() => {
    if (songId) {
      dispatch(getSongAction(songId));
    }
  }, [songId]);
  const tableData = tableDataProps.map((item, i) => {
    return {
      key: item.id,
      index: i + 1 < 10 ? '0' + Number(i + 1) : i + 1,
      name: item.name,
      id: item.id,
      artists: item.ar || item.artists,
      album: item.al || item.album,
    };
  });

  const columnsInit = [
    {
      title: '歌曲名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record, index) => (
        <span
          className={styles.hoverSpan}
          style={{ color: props.currentSongId === record.id ? '#ec4141' : '' }}
          onClick={() => {
            setSongId(record.id);
            dispatch(getPlayAction(tableData));
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '歌手',
      dataIndex: 'singerName',
      key: 'singerName',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record, index) => {
        return (
          record.artists &&
          record.artists.map((item, i, arr) => (
            <span
              key={i}
              style={{
                color: props.currentSongId === record.id ? '#ec4141' : '',
              }}
              onClick={() => {
                history.push('/singerInfo?id=' + item.id);
              }}
            >
              {i !== 0 && <i>{` / `}</i>}
              <span
                className={
                  history.location.pathname !== '/singerInfo'
                    ? styles.hoverSpan
                    : null
                }
              >
                {item.name}
              </span>
            </span>
          ))
        );
      },
    },
  ];
  const columnsMore = [
    {
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 80,
    },
    {
      title: '',
      dataIndex: 'isLove',
      key: 'isLove',
      width: 80,
      render: (text, record, i) => (
        <span
          className={styles.hoverSpan}
          onClick={() => {
            isLoveList.splice(i, 1, !isLoveList[i]);
            setIsLoveList([...isLoveList]);
            console.log(`record`, record);
            dispatch(
              getCollectAction(record, {
                isSongList: false,
                isAdd: isLoveList[i],
              })
            );
          }}
        >
          {isLoveList[i] ? (
            <i className={`iconfont icon-love`}></i>
          ) : (
            <i className={`iconfont icon-will-love`}></i>
          )}
        </span>
      ),
    },
  ];
  const columsAblum = [
    {
      title: '专辑',
      dataIndex: 'album',
      key: 'album',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record, index) => (
        <span
          className={
            history.location.pathname !== '/ablumInfo' ? styles.hoverSpan : null
          }
          onClick={() => {
            if (record.album && record.album.id && record.album.id !== '') {
              history.push('/ablumInfo?id=' + record.album.id);
            }
          }}
        >
          {record.album && record.album.name}
        </span>
      ),
    },
  ];
  let columns = [];
  if (simple) {
    columns = [...columnsInit];
  } else {
    columns = [...columnsMore, ...columnsInit, ...columsAblum];
  }

  return (
    !isLoading && (
      <Table
        showHeader={props.noShowHeader !== true}
        className={styles.tableList}
        rowClassName={styles['tableList-row']}
        columns={columns}
        dataSource={tableData || []}
        pagination={false}
      />
    )
  );
});
