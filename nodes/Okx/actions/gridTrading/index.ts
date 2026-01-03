/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';
import { GRID_ALGO_TYPES, GRID_RUN_TYPES } from '../../constants/options';

export const gridTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['gridTrading'],
			},
		},
		options: [
			{
				name: 'Amend Grid Order',
				value: 'amendGridOrder',
				description: 'Modify grid algo order',
				action: 'Amend grid order',
			},
			{
				name: 'Get Active Grid Orders',
				value: 'getGridOrderList',
				description: 'Get active grid orders',
				action: 'Get grid order list',
			},
			{
				name: 'Get Grid Order Details',
				value: 'getGridOrderDetails',
				description: 'Get grid order details',
				action: 'Get grid order details',
			},
			{
				name: 'Get Grid Order History',
				value: 'getGridOrderHistory',
				description: 'Get grid order history',
				action: 'Get grid order history',
			},
			{
				name: 'Get Grid Positions',
				value: 'getGridPositions',
				description: 'Get grid positions',
				action: 'Get grid positions',
			},
			{
				name: 'Get Grid Sub-Orders',
				value: 'getGridSubOrders',
				description: 'Get grid sub-orders',
				action: 'Get grid sub orders',
			},
			{
				name: 'Place Grid Order',
				value: 'placeGridOrder',
				description: 'Create grid algo order',
				action: 'Place grid order',
			},
			{
				name: 'Stop Grid Order',
				value: 'stopGridOrder',
				description: 'Stop grid algo order',
				action: 'Stop grid order',
			},
			{
				name: 'Withdraw Grid Profit',
				value: 'withdrawGridProfit',
				description: 'Withdraw spot grid profits',
				action: 'Withdraw grid profit',
			},
		],
		default: 'placeGridOrder',
	},
];

export const gridTradingFields: INodeProperties[] = [
	// Place Grid Order fields
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		required: true,
		description: 'Instrument ID (e.g., BTC-USDT)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder', 'stopGridOrder', 'withdrawGridProfit'],
			},
		},
	},
	{
		displayName: 'Algo Order Type',
		name: 'algoOrdType',
		type: 'options',
		options: GRID_ALGO_TYPES,
		default: 'grid',
		required: true,
		description: 'Grid algo order type',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder', 'getGridOrderList', 'getGridOrderHistory'],
			},
		},
	},
	{
		displayName: 'Max Price',
		name: 'maxPx',
		type: 'string',
		default: '',
		required: true,
		description: 'Upper price limit',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Min Price',
		name: 'minPx',
		type: 'string',
		default: '',
		required: true,
		description: 'Lower price limit',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Grid Quantity',
		name: 'gridNum',
		type: 'number',
		default: 10,
		required: true,
		description: 'Number of grid levels (2-200)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Run Type',
		name: 'runType',
		type: 'options',
		options: GRID_RUN_TYPES,
		default: '1',
		required: true,
		description: 'Grid calculation method',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Quote Size',
		name: 'quoteSz',
		type: 'string',
		default: '',
		description: 'Investment amount in quote currency (for spot grid)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Base Size',
		name: 'baseSz',
		type: 'string',
		default: '',
		description: 'Investment amount in base currency (for spot grid)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'sz',
		type: 'string',
		default: '',
		description: 'Contract size (for contract grid)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: [
			{ name: 'Long', value: 'long' },
			{ name: 'Short', value: 'short' },
			{ name: 'Neutral', value: 'neutral' },
		],
		default: 'neutral',
		description: 'Contract grid direction',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	{
		displayName: 'Leverage',
		name: 'lever',
		type: 'string',
		default: '',
		description: 'Leverage (for contract grid)',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder'],
			},
		},
	},
	// Stop/TP/SL fields
	{
		displayName: 'Take Profit Trigger Price',
		name: 'tpTriggerPx',
		type: 'string',
		default: '',
		description: 'Take profit trigger price',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder', 'amendGridOrder'],
			},
		},
	},
	{
		displayName: 'Stop Loss Trigger Price',
		name: 'slTriggerPx',
		type: 'string',
		default: '',
		description: 'Stop loss trigger price',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['placeGridOrder', 'amendGridOrder'],
			},
		},
	},
	// Algo ID fields
	{
		displayName: 'Algo ID',
		name: 'algoId',
		type: 'string',
		default: '',
		required: true,
		description: 'Grid algo order ID',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['stopGridOrder', 'getGridOrderDetails', 'getGridSubOrders', 'getGridPositions', 'amendGridOrder', 'withdrawGridProfit'],
			},
		},
	},
	// Stop type
	{
		displayName: 'Stop Type',
		name: 'stopType',
		type: 'options',
		options: [
			{ name: 'Keep Position', value: '1' },
			{ name: 'Close Position', value: '2' },
		],
		default: '1',
		required: true,
		description: 'Action when stopping grid',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['stopGridOrder'],
			},
		},
	},
	// Sub-order type filter
	{
		displayName: 'Sub-Order Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			{ name: 'Live', value: 'live' },
			{ name: 'Filled', value: 'filled' },
		],
		default: '',
		description: 'Filter sub-order type',
		displayOptions: {
			show: {
				resource: ['gridTrading'],
				operation: ['getGridSubOrders'],
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
				resource: ['gridTrading'],
				operation: ['getGridOrderList', 'getGridOrderHistory', 'getGridSubOrders'],
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

export async function executeGridTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'placeGridOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const algoOrdType = this.getNodeParameter('algoOrdType', i) as string;
			const maxPx = this.getNodeParameter('maxPx', i) as string;
			const minPx = this.getNodeParameter('minPx', i) as string;
			const gridNum = this.getNodeParameter('gridNum', i) as number;
			const runType = this.getNodeParameter('runType', i) as string;
			const quoteSz = this.getNodeParameter('quoteSz', i, '') as string;
			const baseSz = this.getNodeParameter('baseSz', i, '') as string;
			const sz = this.getNodeParameter('sz', i, '') as string;
			const direction = this.getNodeParameter('direction', i, '') as string;
			const lever = this.getNodeParameter('lever', i, '') as string;
			const tpTriggerPx = this.getNodeParameter('tpTriggerPx', i, '') as string;
			const slTriggerPx = this.getNodeParameter('slTriggerPx', i, '') as string;

			const body = buildRequestBody({
				instId,
				algoOrdType,
				maxPx,
				minPx,
				gridNum: String(gridNum),
				runType,
				quoteSz,
				baseSz,
				sz,
				direction,
				lever,
				tpTriggerPx,
				slTriggerPx,
			});
			responseData = await okxApiRequest.call(this, 'POST', '/tradingBot/grid/order-algo', body);
			break;
		}
		case 'amendGridOrder': {
			const algoId = this.getNodeParameter('algoId', i) as string;
			const tpTriggerPx = this.getNodeParameter('tpTriggerPx', i, '') as string;
			const slTriggerPx = this.getNodeParameter('slTriggerPx', i, '') as string;
			const body = buildRequestBody({ algoId, tpTriggerPx, slTriggerPx });
			responseData = await okxApiRequest.call(this, 'POST', '/tradingBot/grid/amend-order-algo', body);
			break;
		}
		case 'stopGridOrder': {
			const algoId = this.getNodeParameter('algoId', i) as string;
			const instId = this.getNodeParameter('instId', i) as string;
			const algoOrdType = this.getNodeParameter('algoOrdType', i, 'grid') as string;
			const stopType = this.getNodeParameter('stopType', i) as string;
			const body = [{ algoId, instId, algoOrdType, stopType }] as unknown as IDataObject;
			responseData = await okxApiRequest.call(this, 'POST', '/tradingBot/grid/stop-order-algo', body);
			break;
		}
		case 'getGridOrderList': {
			const algoOrdType = this.getNodeParameter('algoOrdType', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ algoOrdType, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/tradingBot/grid/orders-algo-pending', {}, query);
			break;
		}
		case 'getGridOrderHistory': {
			const algoOrdType = this.getNodeParameter('algoOrdType', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ algoOrdType, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/tradingBot/grid/orders-algo-history', {}, query);
			break;
		}
		case 'getGridOrderDetails': {
			const algoOrdType = this.getNodeParameter('algoOrdType', i, 'grid') as string;
			const algoId = this.getNodeParameter('algoId', i) as string;
			const query = buildQueryParams({ algoOrdType, algoId });
			responseData = await okxApiRequest.call(this, 'GET', '/tradingBot/grid/orders-algo-details', {}, query);
			break;
		}
		case 'getGridSubOrders': {
			const algoOrdType = this.getNodeParameter('algoOrdType', i, 'grid') as string;
			const algoId = this.getNodeParameter('algoId', i) as string;
			const type = this.getNodeParameter('type', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ algoOrdType, algoId, type, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/tradingBot/grid/sub-orders', {}, query);
			break;
		}
		case 'getGridPositions': {
			const algoOrdType = this.getNodeParameter('algoOrdType', i, 'contract_grid') as string;
			const algoId = this.getNodeParameter('algoId', i) as string;
			const query = buildQueryParams({ algoOrdType, algoId });
			responseData = await okxApiRequest.call(this, 'GET', '/tradingBot/grid/positions', {}, query);
			break;
		}
		case 'withdrawGridProfit': {
			const algoId = this.getNodeParameter('algoId', i) as string;
			const body = buildRequestBody({ algoId });
			responseData = await okxApiRequest.call(this, 'POST', '/tradingBot/grid/withdraw-income', body);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
