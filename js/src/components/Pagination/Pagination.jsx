import React from 'react';
import styles from './style.css';

class Pagination extends React.Component {

  onClick(page) {
    if (this.props.page === page) return;
    if (this.props.onChange) this.props.onChange(page);
  }

	renderFirst() {
    const disabled = this.props.page === 0;
    return this.renderButton(0, '<<', disabled, 'first');
  }

  renderBack() {
    const disabled = this.props.page === 0;
    return this.renderButton(this.props.page - 1, '<', disabled, 'back');
  }

  renderEllipsis() {
    return (<span className={styles.pageElipsis}>...</span>);
  }

  renderPage(i) {
    return this.renderButton(i, i + 1);
  }

  renderNext() {
    const disabled = this.props.page >= this.props.count - 1;
    return this.renderButton(this.props.page + 1, '>', disabled, 'next');
  }

	renderLast() {
    const disabled = this.props.page === this.props.count - 1;
    return this.renderButton(this.props.count - 1, '>>', disabled, 'last');
  }

  renderButton(page, content, disabled = false, keyPrefix = '') {
		const classes = this.props.page === page ? styles.pageActive : styles.page;
    return (
      <button
        key={`${keyPrefix}${page}`}
				className={classes}
        onClick={this.onClick.bind(this, page)}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  render() {
    if (this.props.count <= 1) return false;
    const delta = Math.floor(this.props.limit / 2);
    const start = Math.max(this.props.page - delta, 0) + (this.props.limit + 1) % 2;
    const end = Math.min(this.props.page + delta, this.props.count - 1);
    const showFirst = start >= delta;
    const showLast = end <= this.props.count - delta;
		const pages = [];
		for( let i = start; i <= end ; i++ ) pages.push(i);
    return (
      <div className={styles.pagination}>
        {this.renderBack()}
        {showFirst && this.renderPage(0)}
        {showFirst && this.renderEllipsis()}
        { pages.map((i) => this.renderPage(i))}
        {showLast && this.renderEllipsis()}
        {showLast && this.renderPage(this.props.count - 1)}
        {this.renderNext()}
      </div>
    );
  }

}

Pagination.propTypes = {
  count: React.PropTypes.number.isRequired,
  page: React.PropTypes.number.isRequired,
  limit: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func,
};

Pagination.defaultProps = {
  count: 0,
  page: 0,
  limit: 5,
};

export default Pagination;
