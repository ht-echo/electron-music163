import React, { memo, useEffect, useState } from 'react';
import styles from './style.scss';
import { useSelector, shallowEqual } from 'react-redux';
import { Image, Typography } from 'antd';
import { formatDate } from '../../common/js/utl';
import { useHistory } from 'react-router-dom';

export default memo(function ImgList(props) {
  const noUpTime = props.noUpTime;
  const history = useHistory();
  const { Text } = Typography;
  const dataList = props.dataList;
  const isLoading = useSelector(
    (state) => state.get('isLoading'),
    shallowEqual
  );

  return (
    <div className={styles.imgList}>
      {!isLoading &&
        dataList.map((item) => {
          return (
            <div key={item.id} className={styles.rankingItem}>
              <Image
                onClick={() => {
                  props.isSinger
                    ? history.push('/singerInfo?id=' + item.id)
                    : history.push('/playList?id=' + item.id);
                }}
                preview={false}
                src={item.coverImgUrl || item.img1v1Url}
                className={styles.rankImg}
              ></Image>
              <Text
                onClick={() => {
                  props.isSinger
                    ? history.push('/singerInfo?id=' + item.id)
                    : history.push('/playList?id=' + item.id);
                }}
                className={styles.rankName}
                style={{ width: 130, color: '#ebebeb' }}
                ellipsis
              >
                {item.name}
              </Text>
              {!noUpTime && (
                <p style={{ color: '#9e9e9e' }}>
                  {formatDate(item.updateTime, {
                    y: false,
                    d: true,
                    m: true,
                  })}
                  更新
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
});
