import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import styles from './style.scss';
export default memo(function MyHeader() {
  const history = useHistory();
  return (
    <div className={styles['my-header']}>
      <div className={styles.left}>
        <h1>Music163 Demo</h1>
        <div
          title="后退"
          className={styles.iconBox}
          onClick={() => {
            history.goBack();
          }}
        >
          <LeftOutlined className={styles.iconInfo} />
        </div>
        <div
          title="前进"
          className={styles.iconBox}
          onClick={() => {
            history.goForward();
          }}
        >
          <RightOutlined className={styles.iconInfo} />
        </div>
      </div>
      <div className={styles.nav}>
        <NavLink exact to="/">
          推荐
        </NavLink>
        <NavLink to="/ranking">排行榜</NavLink>
        <NavLink to="/search">搜索</NavLink>
        <NavLink to="/collect">收藏</NavLink>
        <NavLink to="/about">关于</NavLink>
      </div>
    </div>
  );
});
