/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';

export const copyTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['copyTrading'],
			},
		},
		options: [
			{
				name: 'Close Leading Position',
				value: 'closeLeadingPosition',
				description: 'Close a leading position',
				action: 'Close leading position',
			},
			{
				name: 'Get Copy Trading Config',
				value: 'getCopyTradingConfig',
				description: 'Get copy trading configuration',
				action: 'Get copy trading config',
			},
			{
				name: 'Get Current Lead Positions',
				value: 'getCurrentLeadPositions',
				description: 'Get current lead positions',
				action: 'Get current lead positions',
			},
			{
				name: 'Get Lead Position History',
				value: 'getLeadPositionHistory',
				description: 'Get lead position history',
				action: 'Get lead position history',
			},
			{
				name: 'Get Lead Traders',
				value: 'getLeadTraders',
				description: 'Get list of lead traders',
				action: 'Get lead traders',
			},
			{
				name: 'Place Leading Order',
				value: 'placeLeadingOrder',
				description: 'Place a leading order',
				action: 'Place leading order',
			},
			{
				name: 'Set Copy Trading Config',
				value: 'setCopyTradingConfig',
				description: 'Set copy trading configuration',
				action: 'Set copy trading config',
			},
		],
		default: 'getCurrentLeadPositions',
	},
];

export const copyTradingFields: INodeProperties[] = [
	// Instrument Type
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: [
			{ name: 'Swap (Perpetual)', value: 'SWAP' },
			{ name: 'Spot', value: 'SPOT' },
		],
		default: 'SWAP',
		description: 'Instrument type for copy trading',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['getCurrentLeadPositions', 'getLeadPositionHistory', 'getLeadTraders'],
			},
		},
	},
	// Instrument ID
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		required: true,
		description: 'Instrument ID (e.g., BTC-USDT-SWAP)',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder', 'closeLeadingPosition'],
			},
		},
	},
	// Place Leading Order fields
	{
		displayName: 'Trade Mode',
		name: 'tdMode',
		type: 'options',
		options: [
			{ name: 'Cross Margin', value: 'cross' },
			{ name: 'Isolated Margin', value: 'isolated' },
		],
		default: 'cross',
		required: true,
		description: 'Trade mode',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder'],
			},
		},
	},
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		options: [
			{ name: 'Buy', value: 'buy' },
			{ name: 'Sell', value: 'sell' },
		],
		default: 'buy',
		required: true,
		description: 'Order side',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder'],
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
		description: 'Position side',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder', 'closeLeadingPosition'],
			},
		},
	},
	{
		displayName: 'Order Type',
		name: 'ordType',
		type: 'options',
		options: [
			{ name: 'Market', value: 'market' },
			{ name: 'Limit', value: 'limit' },
		],
		default: 'market',
		required: true,
		description: 'Order type',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder'],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'sz',
		type: 'string',
		default: '',
		required: true,
		description: 'Order size',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'px',
		type: 'string',
		default: '',
		description: 'Order price (required for limit orders)',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['placeLeadingOrder'],
			},
		},
	},
	// Close position fields
	{
		displayName: 'Sub-Position ID',
		name: 'subPosId',
		type: 'string',
		default: '',
		required: true,
		description: 'Sub-position ID to close',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['closeLeadingPosition'],
			},
		},
	},
	// Copy Trading Config fields
	{
		displayName: 'Role Type',
		name: 'roleType',
		type: 'options',
		options: [
			{ name: 'Lead Trader', value: '0' },
			{ name: 'Copy Trader', value: '1' },
		],
		default: '1',
		description: 'Role type for configuration',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['getCopyTradingConfig', 'setCopyTradingConfig'],
			},
		},
	},
	{
		displayName: 'Copy Mode',
		name: 'copyMode',
		type: 'options',
		options: [
			{ name: 'Fixed Amount', value: 'fixed_amount' },
			{ name: 'Ratio Copy', value: 'ratio_copy' },
		],
		default: 'fixed_amount',
		description: 'Copy trading mode',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['setCopyTradingConfig'],
			},
		},
	},
	{
		displayName: 'Copy Amount',
		name: 'copyAmt',
		type: 'string',
		default: '',
		description: 'Copy amount for fixed amount mode',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['setCopyTradingConfig'],
			},
		},
	},
	{
		displayName: 'Copy Ratio',
		name: 'copyRatio',
		type: 'string',
		default: '',
		description: 'Copy ratio for ratio copy mode',
		displayOptions: {
			show: {
				resource: ['copyTrading'],
				operation: ['setCopyTradingConfig'],
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
				resource: ['copyTrading'],
				operation: ['getCurrentLeadPositions', 'getLeadPositionHistory', 'getLeadTraders'],
			},
		},
		options: [
			{
				displayName: 'Instrument ID',
				name: 'instId',
				type: 'string',
				default: '',
				description: 'Filter by instrument',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Number of results to return',
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

export async function executeCopyTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCurrentLeadPositions': {
			const instType = this.getNodeParameter('instType', i, 'SWAP') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/copytrading/current-subpositions', {}, query);
			break;
		}
		case 'getLeadPositionHistory': {
			const instType = this.getNodeParameter('instType', i, 'SWAP') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/copytrading/subpositions-history', {}, query);
			break;
		}
		case 'placeLeadingOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const ordType = this.getNodeParameter('ordType', i) as string;
			const sz = this.getNodeParameter('sz', i) as string;
			const px = this.getNodeParameter('px', i, '') as string;
			const body = buildRequestBody({ instId, tdMode, side, posSide, ordType, sz, px });
			responseData = await okxApiRequest.call(this, 'POST', '/copytrading/algo-order', body);
			break;
		}
		case 'closeLeadingPosition': {
			const instId = this.getNodeParameter('instId', i) as string;
			const subPosId = this.getNodeParameter('subPosId', i) as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const body = buildRequestBody({ instId, subPosId, posSide });
			responseData = await okxApiRequest.call(this, 'POST', '/copytrading/close-subposition', body);
			break;
		}
		case 'getLeadTraders': {
			const instType = this.getNodeParameter('instType', i, 'SWAP') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/copytrading/public-lead-traders', {}, query);
			break;
		}
		case 'getCopyTradingConfig': {
			const roleType = this.getNodeParameter('roleType', i, '1') as string;
			const query = buildQueryParams({ roleType });
			responseData = await okxApiRequest.call(this, 'GET', '/copytrading/config', {}, query);
			break;
		}
		case 'setCopyTradingConfig': {
			const roleType = this.getNodeParameter('roleType', i, '1') as string;
			const copyMode = this.getNodeParameter('copyMode', i, '') as string;
			const copyAmt = this.getNodeParameter('copyAmt', i, '') as string;
			const copyRatio = this.getNodeParameter('copyRatio', i, '') as string;
			const body = buildRequestBody({ roleType, copyMode, copyAmt, copyRatio });
			responseData = await okxApiRequest.call(this, 'POST', '/copytrading/set-config', body);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
