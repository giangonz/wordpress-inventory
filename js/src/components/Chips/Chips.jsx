import React from 'react';
import map from 'lodash.map';
import styles from './style.css';

class Chips extends React.Component {

  static propTypes = {
    data: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(i) {
    const data = Object.assign({}, this.props.data);
    delete data[i];
    if (this.props.onChange) this.props.onChange(data);
  }

  render() {
		return (
			<div className={styles.chips}>
				{map(this.props.data, (text, i) =>
					<div className={styles.chip} key={`${i}`}>
						<div className={styles.chipText}>{text}</div>
						<svg className={styles.chipRemove} viewBox="0 0 24 24" onClick={this.onRemove.bind(this, i)}>
							<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
						</svg>
					</div>
				)}
			</div>
		);
  }

};

export default Chips;
