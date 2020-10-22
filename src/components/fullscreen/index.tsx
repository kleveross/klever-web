import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

interface FullscreenProps {
  onChange?: (enable: boolean) => void;
  enable: boolean;
  children?: any;
  zIndex?: number | string;
}

export default class Fullscreen extends React.PureComponent<FullscreenProps> {

  handleDOM: HTMLElement | null = null;
  private viewportWidth: number = window.innerWidth;
  private viewportHeight: number = window.innerHeight;
  private body: HTMLElement = document.body;

  // Save existing styles to prevent loss
  private bodyStyle: string = '';
  private handleDOMStyle: string = '';

  componentDidMount() {
    // Get the child element real DOM
    !this.handleDOM &&
      (this.handleDOM = ReactDOM.findDOMNode(this) as HTMLElement);

    if (!this.handleDOM) {
      return;
    }

    // cache origin style
    this.bodyStyle = this.body.style.cssText;
    this.handleDOMStyle = this.handleDOM.style.cssText;
    window.addEventListener('resize', this.resizeUpdate);
  }

  componentDidUpdate(prevProps: FullscreenProps) {
    const { enable, onChange } = this.props;

    if (enable != prevProps.enable) {
      prevProps.enable ? this.disable() : this.enable();
      onChange && onChange(enable);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeUpdate);
  }

  private resizeUpdate = () => {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    if (!this.handleDOM || !this.props.enable) {
      return;
    }

    this.handleDOM.style.cssText += `
      width:${this.viewportWidth}px;
      height:${this.viewportHeight}px;
    `;
  };

  enable = () => {
    if (!this.handleDOM) {
      return;
    }

    this.handleDOM.style.cssText += `
      position:fixed;
      left:0;
      top:0;
      z-index:${this.props.zIndex};
      width:${this.viewportWidth}px;
      height:${this.viewportHeight}px;
    `;

    this.body.style.cssText += `height:${
      this.viewportHeight
    }px;overflow:hidden;`;
  };

  disable = () => {
    if (!this.handleDOM) {
      return;
    }

    this.handleDOM.style.cssText = this.handleDOMStyle;
    this.body.style.cssText = this.bodyStyle;
  };

  render() {
    return this.props.children;
  }
}
