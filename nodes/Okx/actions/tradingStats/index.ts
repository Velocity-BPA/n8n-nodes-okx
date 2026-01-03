/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams } from '../../utils/helpers';

export const tradingStatsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tradingStats'],
			},
		},
		options: [
			{
				name: 'Get Contracts Open Interest & Volume',
				value: 'getContractsOpenInterestVolume',
				description: 'Get contracts open interest and volume',
				action: 'Get contracts open interest volume',
			},
			{
				name: 'Get Long/Short Ratio',
				value: 'getLongShortRatio',
				description: 'Get long/short ratio',
				action: 'Get long short ratio',
			},
			{
				name: 'Get Margin Lending Ratio',
				value: 'getMarginLendingRatio',
				description: 'Get margin lending ratio',
				action: 'Get margin lending ratio',
			},
			{
				name: 'Get Options Open Interest & Volume',
				value: 'getOptionsOpenInterestVolume',
				description: 'Get options open interest and volume',
				action: 'Get options open interest volume',
			},
			{
				name: 'Get Put/Call Ratio',
				value: 'getPutCallRatio',
				description: 'Get put/call ratio',
				action: 'Get put call ratio',
			},
			{
				name: 'Get Support Coin',
				value: 'getSupportCoin',
				description: 'Get supported coins for trading data',
				action: 'Get support coin',
			},
			{
				name: 'Get Taker Volume',
				value: 'getTakerVolume',
				description: 'Get taker buy/sell volume',
				action: 'Get taker volume',
			},
		],
		default: 'getSupportCoin',
	},
];

export const tradingStatsFields: INodeProperties[] = [
	// Currency
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: 'BTC',
		required: true,
		description: 'Currency (e.g., BTC)',
		displayOptions: {
			show: {
				resource: ['tradingStats'],
				operation: ['getTakerVolume', 'getMarginLendingRatio', 'getLongShortRatio', 'getContractsOpenInterestVolume', 'getOptionsOpenInterestVolume', 'getPutCallRatio'],
			},
		},
	},
	// Instrument Type for taker volume
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: [
			{ name: 'Spot', value: 'SPOT' },
			{ name: 'Swap (Perpetual)', value: 'CONTRACTS' },
		],
		default: 'SPOT',
		required: true,
		description: 'Instrument type',
		displayOptions: {
			show: {
				resource: ['tradingStats'],
				operation: ['getTakerVolume'],
			},
		},
	},
	// Period
	{
		displayName: 'Period',
		name: 'period',
		type: 'options',
		options: [
			{ name: '5 Minutes', value: '5m' },
			{ name: '1 Hour', value: '1H' },
			{ name: '1 Day', value: '1D' },
		],
		default: '1D',
		description: 'Data aggregation period',
		displayOptions: {
			show: {
				resource: ['tradingStats'],
				operation: ['getTakerVolume', 'getMarginLendingRatio', 'getLongShortRatio', 'getContractsOpenInterestVolume', 'getOptionsOpenInterestVolume', 'getPutCallRatio'],
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
				resource: ['tradingStats'],
				operation: ['getTakerVolume', 'getMarginLendingRatio', 'getLongShortRatio', 'getContractsOpenInterestVolume', 'getOptionsOpenInterestVolume', 'getPutCallRatio'],
			},
		},
		options: [
			{
				displayName: 'Begin Time',
				name: 'begin',
				type: 'string',
				default: '',
				description: 'Begin timestamp in milliseconds',
			},
			{
				displayName: 'End Time',
				name: 'end',
				type: 'string',
				default: '',
				description: 'End timestamp in milliseconds',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Number of results to return',
			},
		],
	},
];

export async function executeTradingStatsOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getSupportCoin': {
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/trading-data/support-coin');
			break;
		}
		case 'getTakerVolume': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const instType = this.getNodeParameter('instType', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, instType, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/taker-volume', {}, query);
			break;
		}
		case 'getMarginLendingRatio': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/margin/loan-ratio', {}, query);
			break;
		}
		case 'getLongShortRatio': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/contracts/long-short-account-ratio', {}, query);
			break;
		}
		case 'getContractsOpenInterestVolume': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/contracts/open-interest-volume', {}, query);
			break;
		}
		case 'getOptionsOpenInterestVolume': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/option/open-interest-volume', {}, query);
			break;
		}
		case 'getPutCallRatio': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const period = this.getNodeParameter('period', i, '1D') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, period, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/rubik/stat/option/open-interest-volume-ratio', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
