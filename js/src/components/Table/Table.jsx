import styles from './style.css';
import React from 'react';
import { Table as FixedDataTable, Column, Cell } from 'fixed-data-table';
import DimensionsProvider from './DimensionsProvider.jsx';
import _ from 'lodash';
import TableCell from './TableCell.jsx';
import ActionCell from './ActionCell.jsx';

const FDT = DimensionsProvider(FixedDataTable);
const Table = React.createClass({

  propTypes: {
    columns: React.PropTypes.any.isRequired,
    data: React.PropTypes.array.isRequired,
    actions: React.PropTypes.object,
    rowHeight: React.PropTypes.number,
    headerHeight: React.PropTypes.number,
    defaultColWidth: React.PropTypes.number,
    actionColWidth: React.PropTypes.number,
    actionTitlePath: React.PropTypes.string,
    onAction: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      rowHeight: 40,
      headerHeight: 35,
      defaultColWidth: 100,
      actionColWidth: 65,
      actions: {},
    };
  },

  getInitialState() {
    return {
      isColumnResizing: false,
      columnWidths: _.map(
        this.props.columns,
        col => col.width || this.props.defaultColWidth
      ),
    };
  },

  onColumnResizeEnd(newColumnWidth, columnKey) {
    const columnWidths = {
      ...this.state.columnWidths,
      [columnKey]: newColumnWidth,
    };
    this.setState({ isColumnResizing: false, columnWidths });
  },

  renderActions() {
    if (_.isEmpty(this.props.actions)) {
      return false;
    }
    return (
      <Column
        columnKey="actions"
        header={<Cell />}
        cell={
          <ActionCell
            data={this.props.data}
            actions={this.props.actions}
            title={this.props.actionTitlePath}
            onAction={this.props.onAction}
          />
        }
        width={this.props.actionColWidth}
      />
    );
  },

  render() {
    const data = this.props.data;
    return (
      <div className={styles.table}>
        <FDT
          rowHeight={this.props.rowHeight}
          headerHeight={this.props.headerHeight}
          onColumnResizeEndCallback={this.onColumnResizeEnd}
          isColumnResizing={this.state.isColumnResizing}
          rowsCount={this.props.data.length}
          {...this.props}
        >
          {this.props.columns.map((column, i) =>
            <Column
              key={`${i}`}
              columnKey={`${i}`}
              header={<Cell>{column.title}</Cell>}
              fixed={!!column.fixed}
              cell={<TableCell data={data} path={column.path} link={column.link} style={column.style} />}
              width={this.state.columnWidths[column.path] || column.width}
              flexGrow={column.flex}
              isResizable={column.resizable}
            />
          )}
          {this.renderActions()}
        </FDT>
      </div>
    );
  },
});

export default Table;
