import styles from './style.css';
import React from 'react';
import isEmpty from 'lodash.isempty';
import Chips from '../Chips/Chips.jsx';
import Alert from 'react-s-alert';
import validator from 'email-validator';

class ContactForm extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
		onSubmit: React.PropTypes.func,
  }

  static defaultProps = {
    data: {
			email: "",
			message: "",
			selection: {},
		},
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(field, value) {
    const data = Object.assign({} , this.props.data);
    data[field] = value.target ? value.target.value : value;
    if (this.props.onChange) this.props.onChange(data);
  }

  renderChips(data) {
    if (isEmpty(data.selection)) {
      return (
        <p className={styles.contactFormSelectionMessage}>
          Please select products you are interested in from the list
        </p>
      );
    }
    return (
      <Chips
        data={data.selection}
        onChange={this.onChange.bind(this, 'selection')}
      />
    );
  }

	onSubmit() {
		const data = {
			email: "",
			message: "",
 			selection: {},
			...this.props.data
		};

		let error = "";
		if (!data.email.trim() ) {
			error = "Please specify your email";
		} else if(!validator.validate(data.email)) {
			error = "Please specify a valid email";
		} else if(isEmpty(data.selection)) {
			error = "Select at least one item";
		} else if(!data.message.trim()) {
			error = "Please provide a message";
		}

		// Show Error
		if (error) {
			Alert.error(error, {
				position: 'top-right',
        timeout: 3000,
			});
		} else if (this.props.onSubmit) {

      const p = this.props.onSubmit(this.props.data);
			p.then(() => {
				Alert.success("Thank you, your message was sent", {
					position: 'top-right',
          timeout: 3000,
				});
				this.props.onChange({});
			});
		}

	}

  render() {

		const data = {
			email: "",
			message: "",
 			selection: {},
			...this.props.data
		};

    return (
      <div className={styles.contactForm}>

        <div className={styles.contactFormField}>
          <label className={styles.contactFormFieldLabel}>
            Email
          </label>
          <input
            type='email'
            className={styles.contactFormFieldInput}
            value={data.email}
            onChange={this.onChange.bind(this, 'email')}
          />
        </div>

        <div className={styles.contactFormField}>
          <label className={styles.contactFormFieldLabel}>
            Interested In
          </label>
          <div className={styles.contactFormSelection}>
            {this.renderChips(data)}
          </div>
        </div>

        <div className={styles.contactFormField}>
          <label className={styles.contactFormFieldLabel}>
            Message
          </label>
          <textarea
            className={styles.contactFormFieldTextarea}
            value={data.message}
            onChange={this.onChange.bind(this, 'message')}
          >
          </textarea>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={this.onSubmit}>
            Send
          </button>
        </div>
      </div>
    );
  }

}

export default ContactForm;
