import React from 'react';
import _ from 'lodash';
import cx from 'classnames';

export default function text(props: any) {
  const { className, style, field } = props;

  return (
    <div style={style} className={cx('klever-form-value-text', className)}>
      {_.get(field, 'input.value')}
    </div>
  );
}
