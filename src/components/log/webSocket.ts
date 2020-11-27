import ReconnectingWebSocket from 'reconnecting-websocket';

interface WebSocketProps {
  url: string;
  onBefore?: () => void;
  onData?: (log: string) => void;
  onError?: (error: Event) => void;
}

export interface WebSocketClient extends ReconnectingWebSocket {
  destroy?: () => void;
}

function webSocket(props: WebSocketProps) {
  const { url, onBefore, onData, onError } = props;

  if (!url) {
    return;
  }

  const client: WebSocketClient = new ReconnectingWebSocket(url);
  client.addEventListener('open', () => {
    onBefore && onBefore();
  });
  client.addEventListener('message', (e: any) => {
    onData && onData(e.data);
  });
  client.addEventListener('error', (e: any) => {
    onError && onError(e);
  });

  if (!client.destroy) {
    client.destroy = client.close;
  }
  return client;
}

export default webSocket;
