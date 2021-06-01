import React, { memo, useState, useEffect } from 'react';
import { Image, Typography } from 'antd';
import styles from './style.scss';
import TableList from '../../components/TableList';
import { getSingerInfo } from '../../api';
import qs from 'qs';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getPlayAction, getSongAction } from '../../store/actionCreator';
export default memo(function SingerInfo(props) {
  const dispatch = useDispatch();
  const { Paragraph } = Typography;
  const [singerData, setSingerData] = useState({});
  const { id } = qs.parse(props.location.search.substring(1));
  useEffect(async () => {
    const getSingerData = await getSingerInfo(id);
    setSingerData(getSingerData);
  }, []);
  const { artist = {}, hotSongs = [] } = singerData;
  const isLoading = useSelector(
    (state) => state.get('isLoading'),
    shallowEqual
  );

  return (
    <div className={styles.singerInfo}>
      {!isLoading && (
        <div className={styles.singerInfoBox}>
          <div className={styles.top}>
            <Image
              preview={false}
              className={styles.topImg}
              src={artist.img1v1Url}
              width={150}
              height={150}
            />
            <div className={styles['top-right']}>
              <h1>{artist.name}</h1>
              <Paragraph
                style={{
                  color: '#ebebeb',
                  lineHeight: '24px',
                  fontSize: '12px',
                }}
                className={styles.desc}
                ellipsis={{ rows: 4, expandable: false, symbol: 'more' }}
              >
                简介： {artist.briefDesc}
              </Paragraph>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles['info-top']}>
              <span>热门歌曲</span>
              <span
                onClick={() => {
                  dispatch(getPlayAction(hotSongs));
                  dispatch(getSongAction(hotSongs[0] && hotSongs[0].id));
                }}
                className={styles['rightSpan']}
              >
                播放歌曲
                <i className="iconfont icon-play1"></i>
              </span>
            </div>
          </div>
        </div>
      )}
      <TableList isSinger tableData={hotSongs || []} />
    </div>
  );
});
