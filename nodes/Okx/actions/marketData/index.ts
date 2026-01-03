/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams } from '../../utils/helpers';
import { INSTRUMENT_TYPES, CANDLESTICK_BARS, ORDER_BOOK_DEPTHS } from '../../constants/options';

export const marketDataOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['marketData'],
			},
		},
		options: [
			{
				name: 'Get 24h Volume',
				value: 'get24hVolume',
				description: 'Get 24h trading volume',
				action: 'Get 24h volume',
			},
			{
				name: 'Get Candlesticks',
				value: 'getCandlesticks',
				description: 'Get candlestick/OHLCV data',
				action: 'Get candlesticks',
			},
			{
				name: 'Get Candlesticks History',
				value: 'getCandlesticksHistory',
				description: 'Get historical candlesticks',
				action: 'Get candlesticks history',
			},
			{
				name: 'Get Exchange Rate',
				value: 'getExchangeRate',
				description: 'Get USD/CNY exchange rate',
				action: 'Get exchange rate',
			},
			{
				name: 'Get Index Candlesticks',
				value: 'getIndexCandlesticks',
				description: 'Get index candlestick data',
				action: 'Get index candlesticks',
			},
			{
				name: 'Get Index Tickers',
				value: 'getIndexTickers',
				description: 'Get index ticker data',
				action: 'Get index tickers',
			},
			{
				name: 'Get Mark Price',
				value: 'getMarkPrice',
				description: 'Get mark price',
				action: 'Get mark price',
			},
			{
				name: 'Get Mark Price Candlesticks',
				value: 'getMarkPriceCandlesticks',
				description: 'Get mark price candlestick data',
				action: 'Get mark price candlesticks',
			},
			{
				name: 'Get Oracle Price',
				value: 'getOraclePrice',
				description: 'Get oracle price from multiple sources',
				action: 'Get oracle price',
			},
			{
				name: 'Get Order Book',
				value: 'getOrderBook',
				description: 'Get order book depth',
				action: 'Get order book',
			},
			{
				name: 'Get Ticker',
				value: 'getTicker',
				description: 'Get ticker for specific instrument',
				action: 'Get ticker',
			},
			{
				name: 'Get Tickers',
				value: 'getTickers',
				description: 'Get all tickers by instrument type',
				action: 'Get tickers',
			},
			{
				name: 'Get Trades',
				value: 'getTrades',
				description: 'Get recent trades',
				action: 'Get trades',
			},
			{
				name: 'Get Trades History',
				value: 'getTradesHistory',
				description: 'Get historical trades',
				action: 'Get trades history',
			},
		],
		default: 'getTicker',
	},
];

export const marketDataFields: INodeProperties[] = [
	// Instrument Type field
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: INSTRUMENT_TYPES,
		default: 'SPOT',
		required: true,
		description: 'Instrument type',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTickers', 'getIndexTickers', 'getMarkPrice'],
			},
		},
	},
	// Instrument ID field
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		required: true,
		description: 'Instrument ID (e.g., BTC-USDT)',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTicker', 'getOrderBook', 'getCandlesticks', 'getCandlesticksHistory', 'getTrades', 'getTradesHistory', 'getIndexCandlesticks', 'getMarkPriceCandlesticks'],
			},
		},
	},
	// Order Book Depth
	{
		displayName: 'Depth',
		name: 'sz',
		type: 'options',
		options: ORDER_BOOK_DEPTHS,
		default: '20',
		description: 'Order book depth (number of levels)',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getOrderBook'],
			},
		},
	},
	// Candlestick Bar Size
	{
		displayName: 'Bar Size',
		name: 'bar',
		type: 'options',
		options: CANDLESTICK_BARS,
		default: '1H',
		description: 'Candlestick time interval',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getCandlesticks', 'getCandlesticksHistory', 'getIndexCandlesticks', 'getMarkPriceCandlesticks'],
			},
		},
	},
	// Index ID for index data
	{
		displayName: 'Index ID',
		name: 'instId',
		type: 'string',
		default: '',
		description: 'Index ID (e.g., BTC-USD)',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getIndexTickers'],
			},
		},
	},
	// Additional Fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getCandlesticks', 'getCandlesticksHistory', 'getTrades', 'getTradesHistory', 'getIndexCandlesticks', 'getMarkPriceCandlesticks'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Number of results to return (max 100 for candlesticks, 500 for trades)',
			},
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Pagination cursor (timestamp)',
			},
			{
				displayName: 'Before',
				name: 'before',
				type: 'string',
				default: '',
				description: 'Pagination cursor (timestamp)',
			},
		],
	},
	// Underlying filter for tickers
	{
		displayName: 'Underlying',
		name: 'uly',
		type: 'string',
		default: '',
		description: 'Underlying asset (e.g., BTC-USDT for derivatives)',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTickers', 'getIndexTickers'],
			},
		},
	},
	// Instrument Family
	{
		displayName: 'Instrument Family',
		name: 'instFamily',
		type: 'string',
		default: '',
		description: 'Instrument family (e.g., BTC-USDT)',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTickers', 'getMarkPrice'],
			},
		},
	},
];

export async function executeMarketDataOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getTickers': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const instFamily = this.getNodeParameter('instFamily', i, '') as string;
			const query = buildQueryParams({ instType, uly, instFamily });
			responseData = await okxApiRequest.call(this, 'GET', '/market/tickers', {}, query);
			break;
		}
		case 'getTicker': {
			const instId = this.getNodeParameter('instId', i) as string;
			const query = buildQueryParams({ instId });
			responseData = await okxApiRequest.call(this, 'GET', '/market/ticker', {}, query);
			break;
		}
		case 'getOrderBook': {
			const instId = this.getNodeParameter('instId', i) as string;
			const sz = this.getNodeParameter('sz', i, '20') as string;
			const query = buildQueryParams({ instId, sz });
			responseData = await okxApiRequest.call(this, 'GET', '/market/books', {}, query);
			break;
		}
		case 'getCandlesticks': {
			const instId = this.getNodeParameter('instId', i) as string;
			const bar = this.getNodeParameter('bar', i, '1H') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, bar, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/candles', {}, query);
			break;
		}
		case 'getCandlesticksHistory': {
			const instId = this.getNodeParameter('instId', i) as string;
			const bar = this.getNodeParameter('bar', i, '1H') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, bar, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/history-candles', {}, query);
			break;
		}
		case 'getTrades': {
			const instId = this.getNodeParameter('instId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/trades', {}, query);
			break;
		}
		case 'getTradesHistory': {
			const instId = this.getNodeParameter('instId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/history-trades', {}, query);
			break;
		}
		case 'get24hVolume': {
			responseData = await okxApiRequest.call(this, 'GET', '/market/platform-24-volume');
			break;
		}
		case 'getOraclePrice': {
			responseData = await okxApiRequest.call(this, 'GET', '/market/open-oracle');
			break;
		}
		case 'getExchangeRate': {
			responseData = await okxApiRequest.call(this, 'GET', '/market/exchange-rate');
			break;
		}
		case 'getIndexTickers': {
			const instId = this.getNodeParameter('instId', i, '') as string;
			const quoteCcy = this.getNodeParameter('uly', i, '') as string;
			const query = buildQueryParams({ instId, quoteCcy });
			responseData = await okxApiRequest.call(this, 'GET', '/market/index-tickers', {}, query);
			break;
		}
		case 'getIndexCandlesticks': {
			const instId = this.getNodeParameter('instId', i) as string;
			const bar = this.getNodeParameter('bar', i, '1H') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, bar, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/index-candles', {}, query);
			break;
		}
		case 'getMarkPrice': {
			const instType = this.getNodeParameter('instType', i) as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const instFamily = this.getNodeParameter('instFamily', i, '') as string;
			const query = buildQueryParams({ instType, instId, instFamily });
			responseData = await okxApiRequest.call(this, 'GET', '/market/mark-price', {}, query);
			break;
		}
		case 'getMarkPriceCandlesticks': {
			const instId = this.getNodeParameter('instId', i) as string;
			const bar = this.getNodeParameter('bar', i, '1H') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, bar, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/market/mark-price-candles', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
