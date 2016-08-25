import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';

export function mount(selector, options){
	const heightInt = (options.height - 0) || 500;
	const rowHeight = (options.rowHeight - 0) || 40;
	const dataFn = options.dataFn;
	const postFn = options.postFn;
	render(<App dataFn={dataFn} height={heightInt} rowHeight={rowHeight} dataFn={dataFn} postFn={postFn} />, document.querySelector(selector));
}
