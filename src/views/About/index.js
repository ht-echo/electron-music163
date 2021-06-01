import React, { memo } from 'react';

import styles from './style.scss';
export default memo(function About() {
  const handleOpenExternalUrl = (url) => {
    // shell.openExternal(url);
    window.open(url, '_blank');
  };

  return (
    <div className={styles.about}>
      <h1>
        关于 <span>music163 demo</span>{' '}
      </h1>
      <p>技术栈：react+electron+antd</p>
      <p>
        代码仓库：
        <span
          className={styles.operUrl}
          onClick={() => handleOpenExternalUrl('https://gitee.com/ht-echo/electron-music163')}
        >
          https://gitee.com/electron-music163
        </span>
      </p>

      <br />
      <p>快捷键说明 ：</p>
      <p>{`空格键 / ctrl + p : 播放/暂停`}</p>
      <p>{`ctrl + ← : 上一首歌`}</p>
      <p>{`ctrl + → ：下一首歌`}</p>
      <p>{`ctrl + D ：查看歌词`}</p>
      <p>{`ctrl + L ：喜欢`}</p>
      <p>{`↑ ：音量 + `}</p>
      <p>{`↓ ：音量 - `}</p>
    </div>
  );
});
