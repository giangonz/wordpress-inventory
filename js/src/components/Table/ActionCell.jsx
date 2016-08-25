import React from 'react';
import { Cell } from 'fixed-data-table';
// import ActionButton from '../ActionButton/ActionButton.jsx';
import _ from 'lodash';

const ActionCell = React.createClass({

  propTypes: {
    actions: React.PropTypes.object.isRequired,
    data: React.PropTypes.array,
    title: React.PropTypes.string,
    onAction: React.PropTypes.func,
    rowIndex: React.PropTypes.number,
  },

  onAction(id, action) {
    if (this.props.onAction) {
      const record = this.props.data[this.props.rowIndex];
      this.props.onAction(id, action, record);
    }
  },

  render() {
    const record = this.props.data[this.props.rowIndex];
    const title = _.at(record, this.props.title).pop();

    // <ActionButton
    //   data={record}
    //   actions={this.props.actions}
    //   title={title}
    //   onAction={this.onAction}
    // />

    return (
      <Cell {...this.props}>
      </Cell>
    );
  },
});

export default ActionCell;
