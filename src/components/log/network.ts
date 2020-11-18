import _ from 'lodash';
import { request } from 'umi';

interface NetworkProps {
  url: string;
  params?: object;
  requestConfig?: object;
  onBefore?: () => void;
  onData?: (data: any) => void;
  onComplete?: () => void;
  onError?: (error: Event) => void;
}

const defaultProps = {
  requestConfig: {},
};

function network(props: NetworkProps) {
  const {
    url,
    params,
    requestConfig,
    onBefore,
    onData,
    onError,
    onComplete,
  } = props;

  if (!url) {
    return;
  }

  const queryConfig = _.assign({}, requestConfig, {
    params: params,
  });
  onBefore && onBefore();
  request(url, queryConfig)
    .then(result => {
      onComplete && onComplete();
      onData && onData(result);
    })
    .catch(error => {
      onError && onError(error);
      onComplete && onComplete();
    });

  return {
    destroy: () => {},
  };
}

network.defaultProps = defaultProps;

export default network;
