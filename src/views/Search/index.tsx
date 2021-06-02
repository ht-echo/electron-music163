import React, { memo, useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import TableList from '../../components/TableList';
import { getSearchResult, getHotSearch } from '../../api';
import ListInfo from '../../components/ListInfo';
import ImgList from '../../components/ImgList';

import styles from './style.scss';
export default memo(function Search() {
  const ref = useRef();
  const searchTypeList = ['歌单', '专辑', '歌手', '歌单'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [imgDataList, setImgDataList] = useState([]);
  const [value, setValue] = useState(null);
  useEffect(() => {
    setCurrentIndex(currentIndex);
    searchSong();
  }, [currentIndex]);
  const searchSong = async () => {
    if (value && value !== '') {
      let { result } = await getSearchResult(value, Math.pow(10, currentIndex));
      let dataList =
        result.songs || result.albums || result.artists || result.playlists;
      if (currentIndex === 0 || currentIndex === 1) {
        setTableData([...dataList]);
      } else {
        setImgDataList([...dataList]);
      }
    }
  };
  return (
    <div className={styles.search}>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={styles.searchBtn}
        placeholder="搜点什么想听的"
        prefix={<i onClick={searchSong} className="iconfont icon-search" />}
        bordered={false}
        size="large"
        onPressEnter={searchSong}
      />
      <div className={styles.searchNav}>
        {searchTypeList.map((item, i) => {
          return (
            <span
              style={{
                color: currentIndex === i ? '#f92e58' : '',
              }}
              onClick={() => {
                setCurrentIndex(i);
              }}
              key={i}
            >
              {item}
            </span>
          );
        })}
      </div>
      {currentIndex === 0 || currentIndex === 1 ? (
        <TableList noShowHeader searchData={tableData || []} />
      ) : (
        <ImgList
          isSinger={currentIndex === 2}
          noUpTime
          dataList={imgDataList}
        />
      )}
    </div>
  );
});
