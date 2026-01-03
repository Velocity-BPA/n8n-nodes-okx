/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';

export const earnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['earn'],
			},
		},
		options: [
			{
				name: 'Get Active Earn Orders',
				value: 'getEarnActiveOrders',
				description: 'Get active earn/staking orders',
				action: 'Get active earn orders',
			},
			{
				name: 'Get Earn Offers',
				value: 'getEarnOffers',
				description: 'Get available earn products',
				action: 'Get earn offers',
			},
			{
				name: 'Get Earn Order History',
				value: 'getEarnOrderHistory',
				description: 'Get earn order history',
				action: 'Get earn order history',
			},
			{
				name: 'Get ETH Staking Balance',
				value: 'getETHStakingBalance',
				description: 'Get ETH staking balance',
				action: 'Get eth staking balance',
			},
			{
				name: 'Get SOL Staking Balance',
				value: 'getSOLStakingBalance',
				description: 'Get SOL staking balance',
				action: 'Get sol staking balance',
			},
			{
				name: 'Purchase Earn',
				value: 'purchaseEarn',
				description: 'Subscribe to earn product',
				action: 'Purchase earn',
			},
			{
				name: 'Purchase ETH Staking',
				value: 'purchaseETHStaking',
				description: 'Subscribe to ETH staking',
				action: 'Purchase eth staking',
			},
			{
				name: 'Purchase SOL Staking',
				value: 'purchaseSOLStaking',
				description: 'Subscribe to SOL staking',
				action: 'Purchase sol staking',
			},
			{
				name: 'Redeem Earn',
				value: 'redeemEarn',
				description: 'Redeem from earn product',
				action: 'Redeem earn',
			},
			{
				name: 'Redeem ETH Staking',
				value: 'redeemETHStaking',
				description: 'Redeem from ETH staking',
				action: 'Redeem eth staking',
			},
			{
				name: 'Redeem SOL Staking',
				value: 'redeemSOLStaking',
				description: 'Redeem from SOL staking',
				action: 'Redeem sol staking',
			},
		],
		default: 'getEarnOffers',
	},
];

export const earnFields: INodeProperties[] = [
	// Product ID
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		description: 'Earn product ID',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['purchaseEarn', 'redeemEarn'],
			},
		},
	},
	// Amount
	{
		displayName: 'Amount',
		name: 'amt',
		type: 'string',
		default: '',
		required: true,
		description: 'Investment/redemption amount',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['purchaseEarn', 'redeemEarn', 'purchaseETHStaking', 'redeemETHStaking', 'purchaseSOLStaking', 'redeemSOLStaking'],
			},
		},
	},
	// Currency filter
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Currency filter (e.g., BTC, USDT)',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getEarnOffers', 'getEarnActiveOrders', 'getEarnOrderHistory'],
			},
		},
	},
	// Protocol filter
	{
		displayName: 'Protocol',
		name: 'protocol',
		type: 'string',
		default: '',
		description: 'Protocol filter (e.g., compound)',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getEarnOffers'],
			},
		},
	},
	// Protocol Type
	{
		displayName: 'Protocol Type',
		name: 'protocolType',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			{ name: 'DeFi', value: 'defi' },
			{ name: 'Staking', value: 'staking' },
		],
		default: '',
		description: 'Protocol type filter',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getEarnOffers'],
			},
		},
	},
	// Order ID for redemption
	{
		displayName: 'Order ID',
		name: 'ordId',
		type: 'string',
		default: '',
		description: 'Order ID (required for fixed-term products)',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['redeemEarn'],
			},
		},
	},
	// Investment Data
	{
		displayName: 'Investment Data',
		name: 'investData',
		type: 'json',
		default: '[]',
		description: 'Investment details for multi-currency products',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['purchaseEarn'],
			},
		},
	},
	// Term
	{
		displayName: 'Term',
		name: 'term',
		type: 'string',
		default: '',
		description: 'Investment term (days)',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['purchaseEarn'],
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
				resource: ['earn'],
				operation: ['getEarnActiveOrders', 'getEarnOrderHistory'],
			},
		},
		options: [
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'Filter by product ID',
			},
			{
				displayName: 'Protocol Type',
				name: 'protocolType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'DeFi', value: 'defi' },
					{ name: 'Staking', value: 'staking' },
				],
				default: '',
				description: 'Protocol type filter',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Order state filter',
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

export async function executeEarnOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getEarnOffers': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const protocol = this.getNodeParameter('protocol', i, '') as string;
			const protocolType = this.getNodeParameter('protocolType', i, '') as string;
			const query = buildQueryParams({ ccy, protocol, protocolType });
			responseData = await okxApiRequest.call(this, 'GET', '/finance/staking-defi/offers', {}, query);
			break;
		}
		case 'purchaseEarn': {
			const productId = this.getNodeParameter('productId', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const term = this.getNodeParameter('term', i, '') as string;
			let investData: IDataObject[] = [];
			try {
				investData = JSON.parse(this.getNodeParameter('investData', i, '[]') as string);
			} catch {
				investData = [];
			}
			const body = buildRequestBody({ productId, amt, term, investData: investData.length > 0 ? investData : undefined });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/purchase', body);
			break;
		}
		case 'redeemEarn': {
			const productId = this.getNodeParameter('productId', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const ordId = this.getNodeParameter('ordId', i, '') as string;
			const body = buildRequestBody({ productId, amt, ordId });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/redeem', body);
			break;
		}
		case 'getEarnActiveOrders': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/finance/staking-defi/orders-active', {}, query);
			break;
		}
		case 'getEarnOrderHistory': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/finance/staking-defi/orders-history', {}, query);
			break;
		}
		case 'getETHStakingBalance': {
			responseData = await okxApiRequest.call(this, 'GET', '/finance/staking-defi/eth/balance');
			break;
		}
		case 'purchaseETHStaking': {
			const amt = this.getNodeParameter('amt', i) as string;
			const body = buildRequestBody({ amt });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/eth/purchase', body);
			break;
		}
		case 'redeemETHStaking': {
			const amt = this.getNodeParameter('amt', i) as string;
			const body = buildRequestBody({ amt });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/eth/redeem', body);
			break;
		}
		case 'getSOLStakingBalance': {
			responseData = await okxApiRequest.call(this, 'GET', '/finance/staking-defi/sol/balance');
			break;
		}
		case 'purchaseSOLStaking': {
			const amt = this.getNodeParameter('amt', i) as string;
			const body = buildRequestBody({ amt });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/sol/purchase', body);
			break;
		}
		case 'redeemSOLStaking': {
			const amt = this.getNodeParameter('amt', i) as string;
			const body = buildRequestBody({ amt });
			responseData = await okxApiRequest.call(this, 'POST', '/finance/staking-defi/sol/redeem', body);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
