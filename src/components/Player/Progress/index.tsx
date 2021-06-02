import React, { memo, useRef } from 'react';
import styles from './style.scss';
export default memo(function Progress(props) {
  const progressRef = useRef();
  const { width = 0 } = props;
  const getClickWidth = (e, type) => {
    let clickWidth =
      (e.clientX - progressRef.current.offsetLeft) /
      progressRef.current.offsetWidth;
    clickWidth = clickWidth > 1 ? 1 : clickWidth;
    props.progressClick(clickWidth, progressRef.current.offsetWidth, type);
  };
  const handleClick = (e) => {
    getClickWidth(e);
  };
  const handleMouseDown = () => {
    document.addEventListener('mousemove', progressMouseMove, false);
    document.addEventListener('mouseup', progressMouseUp, false);
  };
  const progressMouseMove = (e) => {
    getClickWidth(e, 'move');
  };

  const progressMouseUp = (e) => {
    getClickWidth(e, 'up');
    document.removeEventListener('mousemove', progressMouseMove, false);
    document.removeEventListener('mouseup', progressMouseUp, false);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      ref={progressRef}
      className={styles.progress}
    >
      <div className={styles.played} style={{ width: width + '%' }}>
        <div className={styles['played-bar']}></div>
      </div>
    </div>
  );
});
