import React from 'react';
import { Cell } from 'fixed-data-table';
import get from 'lodash.get';
import isFunction from 'lodash.isfunction';

const TableCell = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    path: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]).isRequired,
    rowIndex: React.PropTypes.number,
    link: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  render() {
    const data = this.props.data;
    const rowIndex = this.props.rowIndex;
    const path = this.props.path;
    const link = this.props.link;
    const record = data[rowIndex];
    const styleProp = this.props.style;

    // Get the style
    let style = {};
    if (isFunction(styleProp)) {
      style = styleProp(record, rowIndex);
    } else if( styleProp ) {
      style = styleProp;
    }

    // Get the body of the cell
    let body = false;
    if (isFunction(path)) {
      body = path(record, rowIndex);
    } else {
      body = get(record, path);
    }

    // Link the body
    if (link) {
      body = (
        <a href={link}>
          {body}
        </a>
      );
    }

    return (
      <Cell {...this.props} style={style}>
        {body}
      </Cell>
    );
  },
});

export default TableCell;
