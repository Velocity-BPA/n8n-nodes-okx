/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams } from '../../utils/helpers';
import { INSTRUMENT_TYPES } from '../../constants/options';

export const publicDataOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['publicData'],
			},
		},
		options: [
			{
				name: 'Get Delivery/Exercise History',
				value: 'getDeliveryExerciseHistory',
				description: 'Get delivery/exercise history for futures/options',
				action: 'Get delivery exercise history',
			},
			{
				name: 'Get Discount Rate & Interest',
				value: 'getDiscountRateInterest',
				description: 'Get discount rate and interest-free quota',
				action: 'Get discount rate interest',
			},
			{
				name: 'Get Estimated Delivery Price',
				value: 'getEstimatedDeliveryPrice',
				description: 'Get estimated delivery/exercise price',
				action: 'Get estimated delivery price',
			},
			{
				name: 'Get Funding Rate',
				value: 'getFundingRate',
				description: 'Get current funding rate',
				action: 'Get funding rate',
			},
			{
				name: 'Get Funding Rate History',
				value: 'getFundingRateHistory',
				description: 'Get historical funding rates',
				action: 'Get funding rate history',
			},
			{
				name: 'Get Instruments',
				value: 'getInstruments',
				description: 'Get available trading instruments',
				action: 'Get instruments',
			},
			{
				name: 'Get Insurance Fund',
				value: 'getInsuranceFund',
				description: 'Get insurance fund balance',
				action: 'Get insurance fund',
			},
			{
				name: 'Get Interest Rate & Loan Quota',
				value: 'getInterestRateLoanQuota',
				description: 'Get interest rate and loan quota',
				action: 'Get interest rate loan quota',
			},
			{
				name: 'Get Liquidation Orders',
				value: 'getLiquidationOrders',
				description: 'Get liquidation orders',
				action: 'Get liquidation orders',
			},
			{
				name: 'Get Mark Price For Margin',
				value: 'getMarkPriceForMargin',
				description: 'Get mark price for margin trading',
				action: 'Get mark price for margin',
			},
			{
				name: 'Get Open Interest',
				value: 'getOpenInterest',
				description: 'Get open interest',
				action: 'Get open interest',
			},
			{
				name: 'Get Option Market Data',
				value: 'getOptionMarketData',
				description: 'Get option market summary data',
				action: 'Get option market data',
			},
			{
				name: 'Get Position Tiers',
				value: 'getPositionTiers',
				description: 'Get position tier information',
				action: 'Get position tiers',
			},
			{
				name: 'Get Price Limit',
				value: 'getPriceLimit',
				description: 'Get price limit for instrument',
				action: 'Get price limit',
			},
			{
				name: 'Get System Time',
				value: 'getSystemTime',
				description: 'Get OKX server time',
				action: 'Get system time',
			},
		],
		default: 'getInstruments',
	},
];

export const publicDataFields: INodeProperties[] = [
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
				resource: ['publicData'],
				operation: ['getInstruments', 'getDeliveryExerciseHistory', 'getOpenInterest', 'getLiquidationOrders', 'getPositionTiers', 'getInsuranceFund'],
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
		description: 'Instrument ID (e.g., BTC-USDT-SWAP)',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getFundingRate', 'getFundingRateHistory', 'getPriceLimit', 'getEstimatedDeliveryPrice', 'getMarkPriceForMargin'],
			},
		},
	},
	// Instrument ID optional
	{
		displayName: 'Instrument ID',
		name: 'instId',
		type: 'string',
		default: '',
		description: 'Instrument ID (optional filter)',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getInstruments', 'getOpenInterest', 'getLiquidationOrders'],
			},
		},
	},
	// Underlying field
	{
		displayName: 'Underlying',
		name: 'uly',
		type: 'string',
		default: '',
		description: 'Underlying asset (e.g., BTC-USDT)',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getInstruments', 'getDeliveryExerciseHistory', 'getOpenInterest', 'getOptionMarketData', 'getPositionTiers', 'getLiquidationOrders', 'getInsuranceFund'],
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
				resource: ['publicData'],
				operation: ['getInstruments', 'getOptionMarketData'],
			},
		},
	},
	// Currency for discount rate
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Currency (e.g., BTC)',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getDiscountRateInterest', 'getInterestRateLoanQuota', 'getInsuranceFund'],
			},
		},
	},
	// Position Tiers specific fields
	{
		displayName: 'Tier',
		name: 'tier',
		type: 'string',
		default: '',
		description: 'Tier level',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getPositionTiers'],
			},
		},
	},
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
				resource: ['publicData'],
				operation: ['getPositionTiers'],
			},
		},
	},
	// Expiry time for options
	{
		displayName: 'Expiry Time',
		name: 'expTime',
		type: 'string',
		default: '',
		description: 'Expiry time (e.g., 20230331)',
		displayOptions: {
			show: {
				resource: ['publicData'],
				operation: ['getOptionMarketData'],
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
				resource: ['publicData'],
				operation: ['getFundingRateHistory', 'getDeliveryExerciseHistory', 'getLiquidationOrders'],
			},
		},
		options: [
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

export async function executePublicDataOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getInstruments': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const instFamily = this.getNodeParameter('instFamily', i, '') as string;
			const query = buildQueryParams({ instType, uly, instId, instFamily });
			responseData = await okxApiRequest.call(this, 'GET', '/public/instruments', {}, query);
			break;
		}
		case 'getDeliveryExerciseHistory': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, uly, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/public/delivery-exercise-history', {}, query);
			break;
		}
		case 'getOpenInterest': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const query = buildQueryParams({ instType, uly, instId });
			responseData = await okxApiRequest.call(this, 'GET', '/public/open-interest', {}, query);
			break;
		}
		case 'getFundingRate': {
			const instId = this.getNodeParameter('instId', i) as string;
			const query = buildQueryParams({ instId });
			responseData = await okxApiRequest.call(this, 'GET', '/public/funding-rate', {}, query);
			break;
		}
		case 'getFundingRateHistory': {
			const instId = this.getNodeParameter('instId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/public/funding-rate-history', {}, query);
			break;
		}
		case 'getPriceLimit': {
			const instId = this.getNodeParameter('instId', i) as string;
			const query = buildQueryParams({ instId });
			responseData = await okxApiRequest.call(this, 'GET', '/public/price-limit', {}, query);
			break;
		}
		case 'getOptionMarketData': {
			const uly = this.getNodeParameter('uly', i, '') as string;
			const instFamily = this.getNodeParameter('instFamily', i, '') as string;
			const expTime = this.getNodeParameter('expTime', i, '') as string;
			const query = buildQueryParams({ uly, instFamily, expTime });
			responseData = await okxApiRequest.call(this, 'GET', '/public/opt-summary', {}, query);
			break;
		}
		case 'getEstimatedDeliveryPrice': {
			const instId = this.getNodeParameter('instId', i) as string;
			const query = buildQueryParams({ instId });
			responseData = await okxApiRequest.call(this, 'GET', '/public/estimated-price', {}, query);
			break;
		}
		case 'getDiscountRateInterest': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/public/discount-rate-interest-free-quota', {}, query);
			break;
		}
		case 'getSystemTime': {
			responseData = await okxApiRequest.call(this, 'GET', '/public/time');
			break;
		}
		case 'getLiquidationOrders': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const instId = this.getNodeParameter('instId', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ instType, uly, instId, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/public/liquidation-orders', {}, query);
			break;
		}
		case 'getMarkPriceForMargin': {
			const instId = this.getNodeParameter('instId', i) as string;
			const query = buildQueryParams({ instId });
			responseData = await okxApiRequest.call(this, 'GET', '/public/mark-price', {}, query);
			break;
		}
		case 'getPositionTiers': {
			const instType = this.getNodeParameter('instType', i) as string;
			const tdMode = this.getNodeParameter('tdMode', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const tier = this.getNodeParameter('tier', i, '') as string;
			const query = buildQueryParams({ instType, tdMode, uly, tier });
			responseData = await okxApiRequest.call(this, 'GET', '/public/position-tiers', {}, query);
			break;
		}
		case 'getInterestRateLoanQuota': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/public/interest-rate-loan-quota', {}, query);
			break;
		}
		case 'getInsuranceFund': {
			const instType = this.getNodeParameter('instType', i) as string;
			const uly = this.getNodeParameter('uly', i, '') as string;
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ instType, uly, ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/public/insurance-fund', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
