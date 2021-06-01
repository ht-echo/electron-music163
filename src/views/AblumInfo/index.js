import React, { memo } from 'react';
import ListInfo from '../../components/ListInfo';

export default memo(function PlayList(props) {
  return <ListInfo isAblum searchParams={props.location.search} />;
});
