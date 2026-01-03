/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';
import {
	INSTRUMENT_TYPES,
	MARGIN_MODES,
	POSITION_MODES,
	GREEKS_TYPES,
} from '../../constants/options';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Account Config',
				value: 'getAccountConfig',
				description: 'Get account configuration',
				action: 'Get account configuration',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get account balance',
				action: 'Get account balance',
			},
			{
				name: 'Get Fee Rates',
				value: 'getFeeRates',
				description: 'Get fee rates for trading',
				action: 'Get fee rates',
			},
			{
				name: 'Get Interest Accrued',
				value: 'getInterestAccrued',
				description: 'Get interest accrued information',
				action: 'Get interest accrued',
			},
			{
				name: 'Get Interest Rate',
				value: 'getInterestRate',
				description: 'Get interest rate for currency',
				action: 'Get interest rate',
			},
			{
				name: 'Get Max Available Size',
				value: 'getMaxAvailableSize',
				description: 'Get maximum available order size',
				action: 'Get max available size',
			},
			{
				name: 'Get Max Loan',
				value: 'getMaxLoan',
				description: 'Get maximum loan amount',
				action: 'Get max loan',
			},
			{
				name: 'Get Max Size',
				value: 'getMaxSize',
				description: 'Get maximum order size',
				action: 'Get max size',
			},
			{
				name: 'Get Max Withdrawal',
				value: 'getMaxWithdrawal',
				description: 'Get maximum withdrawal amount',
				action: 'Get max withdrawal',
			},
			{
				name: 'Get Position History',
				value: 'getPositionHistory',
				description: 'Get position history',
				action: 'Get position history',
			},
			{
				name: 'Get Positions',
				value: 'getPositions',
				description: 'Get current positions',
				action: 'Get positions',
			},
			{
				name: 'Set Greeks Type',
				value: 'setGreeksType',
				description: 'Set options greeks display type',
				action: 'Set greeks type',
			},
			{
				name: 'Set Leverage',
				value: 'setLeverage',
				description: 'Set leverage for instrument',
				action: 'Set leverage',
			},
			{
				name: 'Set Position Mode',
				value: 'setPositionMode',
				description: 'Set position mode (long/short or net)',
				action: 'Set position mode',
			},
		],
		default: 'getBalance',
	},
];

export const accountFields: INodeProperties[] = [
	// Get Balance fields
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Currency (e.g., BTC, ETH). Leave empty for all currencies.',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getBalance'],
			},
		},
	},
	// Get Positions fields
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: INSTRUMENT_TYPES,
		default: '',
		description: 'Instrument type to filter positions',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getPositions', 'getPositionHistory'],
			},
		},
	},
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		description: 'Instrument ID (e.g., BTC-USDT-SWAP)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getPositions', 'getPositionHistory', 'getMaxSize', 'getMaxAvailableSize', 'setLeverage'],
			},
		},
	},
	{
		displayName: 'Position ID',
		name: 'posId',
		type: 'string',
		default: '',
		description: 'Position ID to filter',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getPositions'],
			},
		},
	},
	// Set Position Mode fields
	{
		displayName: 'Position Mode',
		name: 'posMode',
		type: 'options',
		options: POSITION_MODES,
		default: 'net_mode',
		required: true,
		description: 'Position mode to set',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setPositionMode'],
			},
		},
	},
	// Set Leverage fields
	{
		displayName: 'Leverage',
		name: 'lever',
		type: 'number',
		default: 10,
		required: true,
		description: 'Leverage value to set',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setLeverage'],
			},
		},
	},
	{
		displayName: 'Margin Mode',
		name: 'mgnMode',
		type: 'options',
		options: MARGIN_MODES,
		default: 'cross',
		required: true,
		description: 'Margin mode',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setLeverage', 'getMaxLoan'],
			},
		},
	},
	{
		displayName: 'Position Side',
		name: 'posSide',
		type: 'options',
		options: [
			{ name: 'Long', value: 'long' },
			{ name: 'Short', value: 'short' },
			{ name: 'Net', value: 'net' },
		],
		default: 'net',
		description: 'Position side (for hedge mode)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setLeverage'],
			},
		},
	},
	// Get Max Size fields
	{
		displayName: 'Trade Mode',
		name: 'tdMode',
		type: 'options',
		options: [
			{ name: 'Cash (Spot)', value: 'cash' },
			{ name: 'Cross Margin', value: 'cross' },
			{ name: 'Isolated Margin', value: 'isolated' },
		],
		default: 'cross',
		required: true,
		description: 'Trade mode',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMaxSize', 'getMaxAvailableSize'],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Currency (required for margin/spot)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMaxSize', 'getMaxAvailableSize', 'getMaxLoan', 'getInterestRate', 'getMaxWithdrawal'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'px',
		type: 'string',
		default: '',
		description: 'Order price (optional for market orders)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMaxSize', 'getMaxAvailableSize'],
			},
		},
	},
	// Get Fee Rates fields
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: INSTRUMENT_TYPES,
		default: 'SPOT',
		required: true,
		description: 'Instrument type for fee rates',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getFeeRates'],
			},
		},
	},
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		description: 'Instrument ID (optional)',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getFeeRates'],
			},
		},
	},
	// Set Greeks Type fields
	{
		displayName: 'Greeks Type',
		name: 'greeksType',
		type: 'options',
		options: GREEKS_TYPES,
		default: 'BS',
		required: true,
		description: 'Greeks display type',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['setGreeksType'],
			},
		},
	},
	// Position History additional fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getPositionHistory', 'getInterestAccrued'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Number of results to return (max 100)',
			},
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Pagination cursor',
			},
			{
				displayName: 'Before',
				name: 'before',
				type: 'string',
				default: '',
				description: 'Pagination cursor',
			},
		],
	},
];

export async function executeAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getBalance': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/account/balance', {}, query);
			break;
		}
		case 'getPositions': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const posId = this.getNodeParameter('posId', i, '') as string;
			const query = buildQueryParams({ instType, instId, posId });
			responseData = await okxApiRequest.call(this, 'GET', '/account/positions', {}, query);
			break;
		}
		case 'getPositionHistory': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/account/positions-history', {}, query);
			break;
		}
		case 'getAccountConfig': {
			responseData = await okxApiRequest.call(this, 'GET', '/account/config');
			break;
		}
		case 'setPositionMode': {
			const posMode = this.getNodeParameter('posMode', i) as string;
			const body = buildRequestBody({ posMode });
			responseData = await okxApiRequest.call(this, 'POST', '/account/set-position-mode', body);
			break;
		}
		case 'setLeverage': {
			const instId = this.getNodeParameter('instId', i) as string;
			const lever = this.getNodeParameter('lever', i) as number;
			const mgnMode = this.getNodeParameter('mgnMode', i) as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const body = buildRequestBody({ instId, lever: String(lever), mgnMode, posSide });
			responseData = await okxApiRequest.call(this, 'POST', '/account/set-leverage', body);
			break;
		}
		case 'getMaxSize': {
			const instId = this.getNodeParameter('instId', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const px = this.getNodeParameter('px', i, '') as string;
			const query = buildQueryParams({ instId, tdMode, ccy, px });
			responseData = await okxApiRequest.call(this, 'GET', '/account/max-size', {}, query);
			break;
		}
		case 'getMaxAvailableSize': {
			const instId = this.getNodeParameter('instId', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const px = this.getNodeParameter('px', i, '') as string;
			const query = buildQueryParams({ instId, tdMode, ccy, px });
			responseData = await okxApiRequest.call(this, 'GET', '/account/max-avail-size', {}, query);
			break;
		}
		case 'getMaxLoan': {
			const instId = this.getNodeParameter('instId', i, '') as string;
			const mgnMode = this.getNodeParameter('mgnMode', i) as string;
			const mgnCcy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ instId, mgnMode, mgnCcy });
			responseData = await okxApiRequest.call(this, 'GET', '/account/max-loan', {}, query);
			break;
		}
		case 'getFeeRates': {
			const instType = this.getNodeParameter('instType', i) as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const query = buildQueryParams({ instType, instId });
			responseData = await okxApiRequest.call(this, 'GET', '/account/trade-fee', {}, query);
			break;
		}
		case 'getInterestAccrued': {
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams(additionalFields);
			responseData = await okxApiRequest.call(this, 'GET', '/account/interest-accrued', {}, query);
			break;
		}
		case 'getInterestRate': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/account/interest-rate', {}, query);
			break;
		}
		case 'setGreeksType': {
			const greeksType = this.getNodeParameter('greeksType', i) as string;
			const body = buildRequestBody({ greeksType });
			responseData = await okxApiRequest.call(this, 'POST', '/account/set-greeks', body);
			break;
		}
		case 'getMaxWithdrawal': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/account/max-withdrawal', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
