import React, { memo, useEffect, useState } from 'react';
import { getAllRank } from '../../api';
import ImgList from '../../components/ImgList';
export default memo(function Ranking(props) {
  const [rankData, setRankData] = useState([]);
  useEffect(async () => {
    const { list = [] } = await getAllRank();
    setRankData(list);
  }, []);

  return <ImgList dataList={rankData} />;
});
