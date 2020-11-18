import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import Header from './header';
import ScrollButton from './scrollButton';
import Fullscreen from '@/components/fullscreen';

type LogType = {
  key: number;
  value: string;
};

interface LogProps {
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  data: LogType[];
  loading: boolean;
  hasLineNum: boolean;
  skin: 'dark' | 'light';
  loadingText?: string;
  downloadText?: string;
  emptyText: string;
  continuous: boolean;
  continuousText?: string;
  onDownload?: React.MouseEventHandler<any>;
  onScrollBottom?: () => void;
  onSkinChange?: (skin: string) => void;
  onFullscreen?: (fullscreen: boolean) => void;
}

interface LogState {
  fullscreen: boolean;
  skin: 'dark' | 'light';
  visibleScrollButton: boolean;
  disabledTopButton: boolean;
  disabledBottomButton: boolean;
}

const defaultProps = {
  data: [],
  skin: 'dark',
  loading: false,
  hasLineNum: true,
  continuous: false,
  emptyText: '暂无数据',
};

export default class Log extends React.PureComponent<LogProps, LogState> {
  static defaultProps = defaultProps;
  private bodyDOM: HTMLElement | null = null;
  private scrollThrottle: any = null;

  constructor(props: LogProps) {
    super(props);
    this.state = {
      fullscreen: false,
      skin: props.skin,
      disabledTopButton: false,
      disabledBottomButton: false,
      visibleScrollButton: false,
    };
  }

  componentDidMount() {
    this.scrollThrottle = _.throttle(this.scrollUpdate, 500);
    this.bodyDOM &&
      this.bodyDOM.addEventListener('scroll', this.scrollThrottle);
  }

  componentDidUpdate() {
    if (!this.bodyDOM) {
      return;
    }

    if (
      !this.state.visibleScrollButton &&
      this.bodyDOM.scrollHeight > this.bodyDOM.offsetHeight * 2
    ) {
      this.setState({
        visibleScrollButton: true,
      });
    }

    this.topped() &&
      this.setState({
        disabledTopButton: true,
      });
  }

  componentWillUnmount() {
    if (!this.scrollThrottle) {
      return;
    }
    this.bodyDOM &&
      this.bodyDOM.removeEventListener('scroll', this.scrollThrottle);
    this.scrollThrottle.cancel();
  }

  topped = (offset: number = 0) => {
    if (!this.bodyDOM) {
      return false;
    }

    return this.bodyDOM.scrollTop <= offset;
  };

  bottomed = (offset: number = 0) => {
    if (!this.bodyDOM) {
      return false;
    }

    return (
      this.bodyDOM.scrollTop >=
      this.bodyDOM.scrollHeight - this.bodyDOM.offsetHeight - offset
    );
  };

  private scrollUpdate = () => {
    const { onScrollBottom } = this.props;

    this.scrollButtonUpdate() && onScrollBottom && onScrollBottom();
  };

  scrollButtonUpdate = () => {
    if (!this.bodyDOM) {
      return;
    }

    const topped = this.topped();
    const bottomed = this.bottomed();

    this.setState({
      disabledTopButton: topped,
      disabledBottomButton: bottomed,
    });

    return bottomed;
  };

  toTop = (offset: number = 0) => {
    this.bodyDOM && (this.bodyDOM.scrollTop = offset);
  };

  toBottom = (offset: number = 0) => {
    this.bodyDOM &&
      (this.bodyDOM.scrollTop =
        this.bodyDOM.scrollHeight - this.bodyDOM.offsetHeight - offset);
  };

  getBodyDOM = () => {
    return this.bodyDOM;
  };

  private handleSkinChange = () => {
    const { onSkinChange } = this.props;
    const skin = this.state.skin == 'dark' ? 'light' : 'dark';

    this.setState(
      {
        skin,
      },
      () => {
        onSkinChange && onSkinChange(skin);
      },
    );
  };

  private handleFullscreen = () => {
    const { onFullscreen } = this.props;
    const fullscreen = !this.state.fullscreen;

    this.setState(
      {
        fullscreen,
      },
      () => {
        onFullscreen && onFullscreen(fullscreen);
      },
    );
  };

  private handleTopClick = () => {
    this.toTop();
  };

  private handleBottomClick = () => {
    this.toBottom(10);
  };

  private renderBody() {
    const { fullscreen } = this.state;
    const { data, emptyText, hasLineNum } = this.props;
    const hasLogContent = data.length > 0;
    const bodyStyle: React.CSSProperties = {
      display: hasLogContent ? 'block' : 'none',
    };
    fullscreen && (bodyStyle.maxHeight = '100%');

    return (
      <>
        {!hasLogContent && <div className="klever-log-empty">{emptyText}</div>}
        <div
          className="klever-log-body"
          ref={node => {
            this.bodyDOM = node;
          }}
          // this is for scroll event bind
          style={bodyStyle}
        >
          {data.map((log: LogType) => (
            <div key={log.key} className="klever-log-line">
              {hasLineNum && (
                <span className="klever-log-line-number">{log.key}</span>
              )}
              <div className="klever-log-line-content">{log.value}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  render() {
    const {
      data,
      height,
      style,
      className,
      hasLineNum,
      downloadText,
      continuous,
      continuousText,
      onDownload,
      loading,
      loadingText,
    } = this.props;
    const {
      skin,
      fullscreen,
      disabledTopButton,
      disabledBottomButton,
      visibleScrollButton,
    } = this.state;

    const hasLogContent = data.length > 0;
    const logClass = classNames('klever-log', className, skin, {
      'has-line-number': hasLogContent && hasLineNum,
    });
    const logStyle = _.assign({}, style);
    height && (logStyle.height = height);
    // Reset maximum height in full screen mode
    fullscreen && (logStyle.maxHeight = '100%');

    return (
      <Fullscreen zIndex={205} enable={fullscreen}>
        <div style={logStyle} className={logClass}>
          <Header
            loading={loading}
            onDownload={onDownload}
            disabledDownload={!hasLogContent}
            continuous={continuous}
            loadingText={loadingText}
            continuousText={continuousText}
            downloadText={downloadText}
            fullscreen={fullscreen}
            onSkinChange={this.handleSkinChange}
            onFullscreen={this.handleFullscreen}
          />
          {this.renderBody()}
          <ScrollButton
            visible={visibleScrollButton}
            disabledTop={disabledTopButton}
            disabledBottom={disabledBottomButton}
            onTopClick={this.handleTopClick}
            onBottomClick={this.handleBottomClick}
          />
        </div>
      </Fullscreen>
    );
  }
}
