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
	TRADE_MODES,
	ORDER_TYPES,
	ORDER_SIDES,
	POSITION_SIDES,
	ALGO_ORDER_TYPES,
	TRIGGER_PRICE_TYPES,
} from '../../constants/options';

export const tradeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['trade'],
			},
		},
		options: [
			{
				name: 'Amend Batch Orders',
				value: 'amendBatchOrders',
				description: 'Modify multiple existing orders',
				action: 'Amend batch orders',
			},
			{
				name: 'Amend Order',
				value: 'amendOrder',
				description: 'Modify an existing order',
				action: 'Amend order',
			},
			{
				name: 'Cancel Algo Order',
				value: 'cancelAlgoOrder',
				description: 'Cancel an algo order',
				action: 'Cancel algo order',
			},
			{
				name: 'Cancel Batch Orders',
				value: 'cancelBatchOrders',
				description: 'Cancel multiple orders',
				action: 'Cancel batch orders',
			},
			{
				name: 'Cancel Order',
				value: 'cancelOrder',
				description: 'Cancel an existing order',
				action: 'Cancel order',
			},
			{
				name: 'Close Position',
				value: 'closePosition',
				description: 'Close a position',
				action: 'Close position',
			},
			{
				name: 'Get Algo Order History',
				value: 'getAlgoOrderHistory',
				description: 'Get algo order history',
				action: 'Get algo order history',
			},
			{
				name: 'Get Algo Orders',
				value: 'getAlgoOrders',
				description: 'Get pending algo orders',
				action: 'Get algo orders',
			},
			{
				name: 'Get Fills',
				value: 'getFills',
				description: 'Get recent transaction details',
				action: 'Get fills',
			},
			{
				name: 'Get Fills History',
				value: 'getFillsHistory',
				description: 'Get transaction history (3 months)',
				action: 'Get fills history',
			},
			{
				name: 'Get Open Orders',
				value: 'getOpenOrders',
				description: 'Get pending orders',
				action: 'Get open orders',
			},
			{
				name: 'Get Order',
				value: 'getOrder',
				description: 'Get order details',
				action: 'Get order',
			},
			{
				name: 'Get Order History',
				value: 'getOrderHistory',
				description: 'Get order history (7 days)',
				action: 'Get order history',
			},
			{
				name: 'Get Order History Archive',
				value: 'getOrderHistoryArchive',
				description: 'Get order history (3 months)',
				action: 'Get order history archive',
			},
			{
				name: 'Place Algo Order',
				value: 'placeAlgoOrder',
				description: 'Place an algo order (stop/trigger/iceberg/twap)',
				action: 'Place algo order',
			},
			{
				name: 'Place Batch Orders',
				value: 'placeBatchOrders',
				description: 'Place multiple orders (up to 20)',
				action: 'Place batch orders',
			},
			{
				name: 'Place Order',
				value: 'placeOrder',
				description: 'Place a new order',
				action: 'Place order',
			},
		],
		default: 'placeOrder',
	},
];

export const tradeFields: INodeProperties[] = [
	// Place Order fields
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		required: true,
		description: 'Instrument ID (e.g., BTC-USDT, BTC-USDT-SWAP)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'cancelOrder', 'amendOrder', 'closePosition', 'getOrder', 'placeAlgoOrder', 'cancelAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Trade Mode',
		name: 'tdMode',
		type: 'options',
		options: TRADE_MODES,
		default: 'cash',
		required: true,
		description: 'Trade mode',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'closePosition', 'placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		options: ORDER_SIDES,
		default: 'buy',
		required: true,
		description: 'Order side',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Order Type',
		name: 'ordType',
		type: 'options',
		options: ORDER_TYPES,
		default: 'limit',
		required: true,
		description: 'Order type',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder'],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'sz',
		type: 'string',
		default: '',
		required: true,
		description: 'Order size (quantity)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
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
				resource: ['trade'],
				operation: ['placeOrder'],
			},
		},
	},
	{
		displayName: 'Position Side',
		name: 'posSide',
		type: 'options',
		options: POSITION_SIDES,
		default: 'net',
		description: 'Position side (for hedge mode)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'closePosition', 'placeAlgoOrder'],
			},
		},
	},
	// Order ID fields
	{
		displayName: 'Order ID',
		name: 'ordId',
		type: 'string',
		default: '',
		description: 'Order ID (either ordId or clOrdId required)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['cancelOrder', 'amendOrder', 'getOrder'],
			},
		},
	},
	{
		displayName: 'Client Order ID',
		name: 'clOrdId',
		type: 'string',
		default: '',
		description: 'Client-assigned order ID',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'cancelOrder', 'amendOrder', 'getOrder', 'placeAlgoOrder'],
			},
		},
	},
	// Amend Order fields
	{
		displayName: 'New Size',
		name: 'newSz',
		type: 'string',
		default: '',
		description: 'New order size',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['amendOrder'],
			},
		},
	},
	{
		displayName: 'New Price',
		name: 'newPx',
		type: 'string',
		default: '',
		description: 'New order price',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['amendOrder'],
			},
		},
	},
	// Close Position fields
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Margin currency (required for isolated margin)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['closePosition'],
			},
		},
	},
	{
		displayName: 'Auto Cancel',
		name: 'autoCxl',
		type: 'boolean',
		default: false,
		description: 'Whether to automatically cancel pending close orders',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['closePosition'],
			},
		},
	},
	// Algo Order fields
	{
		displayName: 'Algo Order Type',
		name: 'ordType',
		type: 'options',
		options: ALGO_ORDER_TYPES,
		default: 'conditional',
		required: true,
		description: 'Algo order type',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Trigger Price',
		name: 'triggerPx',
		type: 'string',
		default: '',
		description: 'Trigger price for conditional/trigger orders',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Trigger Price Type',
		name: 'triggerPxType',
		type: 'options',
		options: TRIGGER_PRICE_TYPES,
		default: 'last',
		description: 'Trigger price type',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Order Price',
		name: 'orderPx',
		type: 'string',
		default: '',
		description: 'Order price when triggered (-1 for market)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeAlgoOrder'],
			},
		},
	},
	// Take Profit / Stop Loss fields
	{
		displayName: 'Take Profit Trigger Price',
		name: 'tpTriggerPx',
		type: 'string',
		default: '',
		description: 'Take profit trigger price',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Take Profit Order Price',
		name: 'tpOrdPx',
		type: 'string',
		default: '',
		description: 'Take profit order price (-1 for market)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
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
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
			},
		},
	},
	{
		displayName: 'Stop Loss Order Price',
		name: 'slOrdPx',
		type: 'string',
		default: '',
		description: 'Stop loss order price (-1 for market)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder', 'placeAlgoOrder'],
			},
		},
	},
	// Algo Order ID field
	{
		displayName: 'Algo ID',
		name: 'algoId',
		type: 'string',
		default: '',
		required: true,
		description: 'Algo order ID',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['cancelAlgoOrder'],
			},
		},
	},
	// Batch Orders field
	{
		displayName: 'Orders',
		name: 'orders',
		type: 'json',
		default: '[]',
		required: true,
		description: 'Array of order objects (up to 20)',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeBatchOrders', 'cancelBatchOrders', 'amendBatchOrders'],
			},
		},
	},
	// Get Orders filters
	{
		displayName: 'Instrument Type',
		name: 'instType',
		type: 'options',
		options: INSTRUMENT_TYPES,
		default: '',
		description: 'Filter by instrument type',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['getOpenOrders', 'getOrderHistory', 'getOrderHistoryArchive', 'getFills', 'getFillsHistory', 'getAlgoOrders', 'getAlgoOrderHistory'],
			},
		},
	},
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		description: 'Filter by instrument ID',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['getOpenOrders', 'getOrderHistory', 'getOrderHistoryArchive', 'getFills', 'getFillsHistory', 'getAlgoOrders', 'getAlgoOrderHistory'],
			},
		},
	},
	{
		displayName: 'Order Type',
		name: 'ordType',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			...ALGO_ORDER_TYPES,
		],
		default: '',
		description: 'Filter by algo order type',
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['getAlgoOrders', 'getAlgoOrderHistory'],
			},
		},
	},
	// Additional options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['placeOrder'],
			},
		},
		options: [
			{
				displayName: 'Reduce Only',
				name: 'reduceOnly',
				type: 'boolean',
				default: false,
				description: 'Whether the order is reduce-only',
			},
			{
				displayName: 'Target Currency',
				name: 'tgtCcy',
				type: 'options',
				options: [
					{ name: 'Base Currency', value: 'base_ccy' },
					{ name: 'Quote Currency', value: 'quote_ccy' },
				],
				default: 'base_ccy',
				description: 'Target currency for size',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Order tag for tracking',
			},
		],
	},
	// Pagination fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['trade'],
				operation: ['getOpenOrders', 'getOrderHistory', 'getOrderHistoryArchive', 'getFills', 'getFillsHistory', 'getAlgoOrders', 'getAlgoOrderHistory'],
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

export async function executeTradeOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'placeOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const ordType = this.getNodeParameter('ordType', i) as string;
			const sz = this.getNodeParameter('sz', i) as string;
			const px = this.getNodeParameter('px', i, '') as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const clOrdId = this.getNodeParameter('clOrdId', i, '') as string;
			const tpTriggerPx = this.getNodeParameter('tpTriggerPx', i, '') as string;
			const tpOrdPx = this.getNodeParameter('tpOrdPx', i, '') as string;
			const slTriggerPx = this.getNodeParameter('slTriggerPx', i, '') as string;
			const slOrdPx = this.getNodeParameter('slOrdPx', i, '') as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

			const body = buildRequestBody({
				instId,
				tdMode,
				side,
				ordType,
				sz,
				px,
				posSide,
				clOrdId,
				tpTriggerPx,
				tpOrdPx,
				slTriggerPx,
				slOrdPx,
				...additionalOptions,
			});
			responseData = await okxApiRequest.call(this, 'POST', '/trade/order', body);
			break;
		}
		case 'placeBatchOrders': {
			const orders = JSON.parse(this.getNodeParameter('orders', i) as string);
			responseData = await okxApiRequest.call(this, 'POST', '/trade/batch-orders', orders);
			break;
		}
		case 'cancelOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const ordId = this.getNodeParameter('ordId', i, '') as string;
			const clOrdId = this.getNodeParameter('clOrdId', i, '') as string;
			const body = buildRequestBody({ instId, ordId, clOrdId });
			responseData = await okxApiRequest.call(this, 'POST', '/trade/cancel-order', body);
			break;
		}
		case 'cancelBatchOrders': {
			const orders = JSON.parse(this.getNodeParameter('orders', i) as string);
			responseData = await okxApiRequest.call(this, 'POST', '/trade/cancel-batch-orders', orders);
			break;
		}
		case 'amendOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const ordId = this.getNodeParameter('ordId', i, '') as string;
			const clOrdId = this.getNodeParameter('clOrdId', i, '') as string;
			const newSz = this.getNodeParameter('newSz', i, '') as string;
			const newPx = this.getNodeParameter('newPx', i, '') as string;
			const body = buildRequestBody({ instId, ordId, clOrdId, newSz, newPx });
			responseData = await okxApiRequest.call(this, 'POST', '/trade/amend-order', body);
			break;
		}
		case 'amendBatchOrders': {
			const orders = JSON.parse(this.getNodeParameter('orders', i) as string);
			responseData = await okxApiRequest.call(this, 'POST', '/trade/amend-batch-orders', orders);
			break;
		}
		case 'closePosition': {
			const instId = this.getNodeParameter('instId', i) as string;
			const mgnMode = this.getNodeParameter('tdMode', i) as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const autoCxl = this.getNodeParameter('autoCxl', i, false) as boolean;
			const body = buildRequestBody({ instId, mgnMode, posSide, ccy, autoCxl: autoCxl ? 'true' : '' });
			responseData = await okxApiRequest.call(this, 'POST', '/trade/close-position', body);
			break;
		}
		case 'getOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const ordId = this.getNodeParameter('ordId', i, '') as string;
			const clOrdId = this.getNodeParameter('clOrdId', i, '') as string;
			const query = buildQueryParams({ instId, ordId, clOrdId });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/order', {}, query);
			break;
		}
		case 'getOpenOrders': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/orders-pending', {}, query);
			break;
		}
		case 'getOrderHistory': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/orders-history', {}, query);
			break;
		}
		case 'getOrderHistoryArchive': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/orders-history-archive', {}, query);
			break;
		}
		case 'getFills': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/fills', {}, query);
			break;
		}
		case 'getFillsHistory': {
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/fills-history', {}, query);
			break;
		}
		case 'placeAlgoOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const ordType = this.getNodeParameter('ordType', i) as string;
			const sz = this.getNodeParameter('sz', i) as string;
			const posSide = this.getNodeParameter('posSide', i, '') as string;
			const clOrdId = this.getNodeParameter('clOrdId', i, '') as string;
			const triggerPx = this.getNodeParameter('triggerPx', i, '') as string;
			const triggerPxType = this.getNodeParameter('triggerPxType', i, '') as string;
			const orderPx = this.getNodeParameter('orderPx', i, '') as string;
			const tpTriggerPx = this.getNodeParameter('tpTriggerPx', i, '') as string;
			const tpOrdPx = this.getNodeParameter('tpOrdPx', i, '') as string;
			const slTriggerPx = this.getNodeParameter('slTriggerPx', i, '') as string;
			const slOrdPx = this.getNodeParameter('slOrdPx', i, '') as string;

			const body = buildRequestBody({
				instId,
				tdMode,
				side,
				ordType,
				sz,
				posSide,
				algoClOrdId: clOrdId,
				triggerPx,
				triggerPxType,
				orderPx,
				tpTriggerPx,
				tpOrdPx,
				slTriggerPx,
				slOrdPx,
			});
			responseData = await okxApiRequest.call(this, 'POST', '/trade/order-algo', body);
			break;
		}
		case 'cancelAlgoOrder': {
			const instId = this.getNodeParameter('instId', i) as string;
			const algoId = this.getNodeParameter('algoId', i) as string;
			const body = [{ instId, algoId }] as unknown as IDataObject;
			responseData = await okxApiRequest.call(this, 'POST', '/trade/cancel-algos', body);
			break;
		}
		case 'getAlgoOrders': {
			const ordType = this.getNodeParameter('ordType', i, '') as string;
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ordType, instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/orders-algo-pending', {}, query);
			break;
		}
		case 'getAlgoOrderHistory': {
			const ordType = this.getNodeParameter('ordType', i, '') as string;
			const instType = this.getNodeParameter('instType', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ordType, state: 'effective', instType, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/trade/orders-algo-history', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
