import React from 'react';
import ReactDOM from 'react-dom';

function DimensionsProvider(ComposedComponent) {
  return React.createClass({

    displayName: 'DimensionsProvider',

    getInitialState() {
      return {
        width: 1,
        height: 1,
      };
    },

    componentDidMount() {
      this.node = ReactDOM.findDOMNode(this);
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
      this.onWindowResize();
    },

    componentWillUnmount() {
      window.removeEventListener('resize', this.onWindowResize);
      this.node = null;
    },

    onWindowResize() {
      const parent = this.node.parentNode;
      const width = parent.offsetWidth;
      const height = window.innerHeight - this.node.offsetTop - 100;
      this.setState({ width, height });
    },

    render() {
      return <ComposedComponent {...this.state} {...this.props} />;
    },

  });
}

export default DimensionsProvider;
