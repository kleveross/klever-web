import React, { useEffect } from 'react';
import { history } from 'umi';

export default function() {
  useEffect(() => {
    history.push('/model/projects');
  });

  return <div> hello klever </div>;
}
