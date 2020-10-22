import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface HeaderProps {
  visible: boolean;
  disabledTop: boolean;
  disabledBottom: boolean;
  onTopClick?: React.MouseEventHandler<any>;
  onBottomClick?: React.MouseEventHandler<any>;
}

const ScrollButton = (props: HeaderProps) => {
  const {
    visible,
    disabledTop,
    onTopClick,
    disabledBottom,
    onBottomClick,
  } = props;

  return (
    <div
      className="klever-log-scroll-button"
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <button
        type="button"
        onClick={onTopClick}
        disabled={disabledTop}
        className="klever-log-button"
      >
        <CaretUpOutlined className="klever-log-icon" />
      </button>
      <button
        type="button"
        onClick={onBottomClick}
        disabled={disabledBottom}
        className="klever-log-button"
      >
        <CaretDownOutlined className="klever-log-icon" />
      </button>
    </div>
  );
};

export default ScrollButton;
