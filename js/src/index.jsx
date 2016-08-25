import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';

export function mount(selector, height, dataFn, postFn){
	const heightInt = height - 0;
	render(<App dataFn={dataFn} height={heightInt} postFn={postFn} />, document.querySelector(selector));
}
