import React from 'react';
import map from 'lodash.map';
import get from 'lodash.get';
import foreach from 'lodash.foreach';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import data from './assets/data.json';
import classNames from 'classnames';
import style from './style.css';
import Table from './components/Table/Table.jsx';
import Pagination from './components/Pagination/Pagination.jsx';
import ContactForm from './components/ContactForm/ContactForm.jsx';

class App extends React.Component {

	static propTypes = {
		dataFn: React.PropTypes.func,
		postFn: React.PropTypes.func,
		height: React.PropTypes.int,
	}

	static defaultProps = {
		height: 500,
	}

  constructor(props) {
    super(props);
    this.state = {
			page: 0,
			pageCount: 0,
			size: 100,
			columns: [],
			defaultColumn: "",
			records: [],
			form: { selection: {} },
			search: "",
		};
		this.loadData = this.loadData.bind(this);
    this.onPage = this.onPage.bind(this);
		this.isSelected = this.isSelected.bind(this);
		this.onSelectionClick = this.onSelectionClick.bind(this);
		this.onFormChange = this.onFormChange.bind(this);
		this.onSearch = this.onSearch.bind(this);
  }

	componentDidMount() {
		this.requestData(this.state.search, this.state.page);
	}

	requestData(search, page) {

		// Simulate a response if there is no callback
		if(!this.props.dataFn) {
			const response = Object.assign({} , data);
			const start = this.state.size * page;
			const end = start + this.state.size;
			response.data = response.data.slice(start, end);
			this.loadData(response);
			return
		}

		const limit = this.state.size;
		const offset = this.state.size * page;
		this.props.dataFn(search, limit, offset).then((response) => {
			this.loadData(response);
		});
	}

	loadData(data) {
		const columns = this.getColumns(data.columns);
		const records = data.data;
		const defaultColumn = data.defaultColumn || (columns[0] && columns[0].path);
		const pageCount = Math.ceil(data.total / this.state.size);
		this.setState( { defaultColumn, columns, records, pageCount });
	}

	isSelected(id) {
		return !!this.state.form.selection[id];
	}

	getColumns(data) {
		const cstyle = (row, index) => {
			if (!this.isSelected(row.id)) return {};
			return {
				backgroundColor: '#E9F2F7', // TODO: don't harcode this value
			}
		};

		// Add column style
		const columns = data.map((column) => {
			return { ...column, style: cstyle };
		});

		// Add Selection column
		columns.push({
			title: '',
			width: 35,
			resizable: false,
			fixed: true,
			style: cstyle,
			path: (row, index) => {
				const selected = this.isSelected(row.id);
				const className = selected ? style.minus : style.plus;
				return (
					<span
						className={className}
						onClick={this.onSelectionClick.bind(this, index)}>
					</span>
				);
			}
		});

		return columns;
	}

  onPage(page) {
    this.setState({ page });
		this.requestData(this.state.search, page);
  }

	onSearch(e) {
		const search = e.target.value;
		this.setState({ search , page: 0 });
		this.requestData(search, this.state.page);
	}

	onSelectionClick(index) {
		const record = this.state.records[index];
		const id = record.id;
		const selected = this.isSelected(id);

		let form = Object.assign({}, this.state.form);
		if (selected) {
			delete form.selection[id];
		} else {
			form.selection[id] = record[this.state.defaultColumn];
		}

		this.setState({ form });
	}

  onFormChange(form) {
		this.setState({ form });
  }

  render() {

		const columns = this.state.columns;
		const records = this.state.records;
		const form = this.state.form;

    return (
      <div className={style.container}>
				<Alert stack={{limit: 1}} />
        <div className={style.table}>
					<div className={style.tableInner}>
						<div className={style.header}>
							Product List
							<input
								type="search"
								className={style.searchInput}
								placeholder="search"
								value={this.state.search}
								onChange={this.onSearch}
								style={{ float: 'right' }}
							/>
						</div>
						<Table
							data={records}
							columns={columns}
							height={this.props.height}
						/>
						<Pagination
							count={this.state.pageCount}
							page={this.state.page}
							onChange={this.onPage}
						/>
					</div>
        </div>
				<div className={style.form}>
					<div className={style.header}>Request Information</div>
					<div className={style.formInner}>
          	<ContactForm data={form} onChange={this.onFormChange} onSubmit={this.props.postFn} />
					</div>
				</div>
      </div>
    )
  }
}

export default App;
