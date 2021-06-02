import React, { memo, useEffect, useState } from 'react';
import styles from './style.scss';
import { formatPlayCount } from '../../common/js/utl';

import { getRecommendList } from '../../api';
export default memo(function Recommend(props) {
  const [playList, setPlayList] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    let data = await getRecommendList();
    if (data && data.playlists.length > 0) {
      setPlayList(data.playlists);
    }
  };
  return (
    <div className={styles.recommend}>
      <div className={styles.list}>
        {playList.map((item) => {
          return (
            <div key={item.id} className={styles.listBox}>
              <div className={styles.listInfo}>
                <div
                  className={styles.imgBox}
                  onClick={() => {
                    props.history.push(`/playlist?id=${item.id}`);
                  }}
                >
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={item.coverImgUrl}
                  />
                  <i className="iconfont icon-play"></i>
                  <div className={styles['icon-counts']}>
                    <i className="iconfont icon-erji" />
                    <span>{formatPlayCount(item.playCount)}</span>
                  </div>
                </div>

                <p className={styles.titleName}>{item.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
