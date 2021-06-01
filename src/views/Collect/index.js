import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { List, Divider, Typography, Image } from 'antd';
import TableList from '../../components/TableList';
import { getPlayAction, getSongAction } from '../../store/actionCreator';
import styles from './style.scss';
export default memo(function Collect() {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songListData, setSongListData] = useState({});
  const history = useHistory();
  const { Text, Title } = Typography;
  const { collectSongList = [] } = useSelector((state) =>
    state.get('collector')
  );
  const { loveList = [] } = useSelector((state) => state.get('collector'));
  useEffect(() => {
    setSongListData({
      name: '我喜欢的音乐',
      imgUrl:
        'http://p4.music.126.net/6zMaU7JQcL9MksXf4bIOEA==/109951162819128862.jpg',
      tableData: loveList,
    });
  }, [loveList]);
  return (
    <div className={styles.collect}>
      <div className={styles.left}>
        <Title className={styles.title}>创建的歌单</Title>
        <Text
          style={{ color: currentIndex === 0 ? '#f92e58' : '' }}
          className={styles.listText}
          onClick={() => {
            setCurrentIndex(0);
            setSongListData({
              name: '我喜欢的音乐',
              imgUrl:
                'http://p4.music.126.net/6zMaU7JQcL9MksXf4bIOEA==/109951162819128862.jpg',
              tableData: loveList,
            });
          }}
        >
          <i className="iconfont icon-will-love"></i> 我喜欢的音乐
        </Text>
        <Title className={styles.title}>收藏的歌单</Title>
        {collectSongList.map((item, i) => (
          <Text
            key={item.id}
            style={{
              width: 200,
              color: currentIndex === Number(i) + 1 ? '#f92e58' : '',
            }}
            className={styles.listText}
            ellipsis
            onClick={() => {
              setCurrentIndex(Number(i) + 1);
              setSongListData({
                name: item.name,
                imgUrl: item.imgUrl,
                tableData: item.songList,
              });
            }}
          >
            <i className="iconfont icon-yinleliebiao"></i>
            {item.name}
          </Text>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className="img-container">
            <div className="img-filter">
              {' '}
              <i className="iconfont icon-will-love"></i>
            </div>
            <Image
              preview={false}
              className={styles.topImg}
              src={songListData.imgUrl}
              width={150}
              height={150}
            />
          </div>
          <div className={styles['top-right']}>
            <h1>{songListData.name}</h1>
            <p>
              歌曲数：{songListData.tableData && songListData.tableData.length}
            </p>
          </div>
        </div>
        <div className={styles['table-top']}>
          <span
            className={styles['rightSpan']}
            onClick={() => {
              dispatch(getPlayAction(songListData.tableData));
              dispatch(
                getSongAction(
                  songListData.tableData[0] && songListData.tableData[0].id
                )
              );
            }}
          >
            播放歌曲<i className="iconfont icon-play1"></i>
          </span>
        </div>
        <TableList tableData={songListData.tableData || []} />
      </div>
    </div>
  );
});
