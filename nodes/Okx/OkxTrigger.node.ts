/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { okxApiRequest } from './transport/request';

// Runtime licensing notice (logged once per node load)
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeLogged = false;

export class OkxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OKX Trigger',
		name: 'okxTrigger',
		icon: 'file:okx.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on OKX events',
		defaults: {
			name: 'OKX Trigger',
		},
		polling: true,
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'okxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Algo Order Triggered',
						value: 'algoOrderTriggered',
						description: 'Trigger when an algo order is triggered',
					},
					{
						name: 'Balance Changed',
						value: 'balanceChanged',
						description: 'Trigger when account balance changes',
					},
					{
						name: 'Funding Rate Alert',
						value: 'fundingRateAlert',
						description: 'Trigger when funding rate exceeds threshold',
					},
					{
						name: 'New Order',
						value: 'newOrder',
						description: 'Trigger when a new order is placed',
					},
					{
						name: 'Order Canceled',
						value: 'orderCanceled',
						description: 'Trigger when an order is canceled',
					},
					{
						name: 'Order Filled',
						value: 'orderFilled',
						description: 'Trigger when an order is filled',
					},
					{
						name: 'Position Changed',
						value: 'positionChanged',
						description: 'Trigger when position changes',
					},
					{
						name: 'Price Alert',
						value: 'priceAlert',
						description: 'Trigger when price crosses threshold',
					},
				],
				default: 'orderFilled',
				description: 'The event to trigger on',
			},
			// Instrument filters
			{
				displayName: 'Instrument Type',
				name: 'instType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Spot', value: 'SPOT' },
					{ name: 'Margin', value: 'MARGIN' },
					{ name: 'Swap (Perpetual)', value: 'SWAP' },
					{ name: 'Futures', value: 'FUTURES' },
					{ name: 'Option', value: 'OPTION' },
				],
				default: '',
				description: 'Filter by instrument type',
				displayOptions: {
					show: {
						event: ['newOrder', 'orderFilled', 'orderCanceled', 'positionChanged', 'algoOrderTriggered'],
					},
				},
			},
			{
				displayName: 'Instrument ID',
				name: 'instId',
				type: 'string',
				default: '',
				description: 'Filter by instrument ID (e.g., BTC-USDT)',
				displayOptions: {
					show: {
						event: ['newOrder', 'orderFilled', 'orderCanceled', 'positionChanged', 'priceAlert', 'fundingRateAlert'],
					},
				},
			},
			// Price Alert fields
			{
				displayName: 'Price Threshold',
				name: 'priceThreshold',
				type: 'number',
				default: 0,
				description: 'Price threshold for alert',
				displayOptions: {
					show: {
						event: ['priceAlert'],
					},
				},
			},
			{
				displayName: 'Price Direction',
				name: 'priceDirection',
				type: 'options',
				options: [
					{ name: 'Above', value: 'above' },
					{ name: 'Below', value: 'below' },
				],
				default: 'above',
				description: 'Trigger when price is above or below threshold',
				displayOptions: {
					show: {
						event: ['priceAlert'],
					},
				},
			},
			// Funding Rate Alert fields
			{
				displayName: 'Funding Rate Threshold (%)',
				name: 'fundingRateThreshold',
				type: 'number',
				default: 0.1,
				description: 'Funding rate threshold as percentage',
				displayOptions: {
					show: {
						event: ['fundingRateAlert'],
					},
				},
			},
			// Balance Changed fields
			{
				displayName: 'Currency',
				name: 'ccy',
				type: 'string',
				default: '',
				description: 'Filter by currency (e.g., BTC, USDT)',
				displayOptions: {
					show: {
						event: ['balanceChanged'],
					},
				},
			},
			{
				displayName: 'Balance Change Threshold',
				name: 'balanceThreshold',
				type: 'number',
				default: 0,
				description: 'Minimum balance change to trigger (0 for any change)',
				displayOptions: {
					show: {
						event: ['balanceChanged'],
					},
				},
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// Log licensing notice once per node load
		if (!licenseNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licenseNoticeLogged = true;
		}

		const event = this.getNodeParameter('event') as string;
		const webhookData = this.getWorkflowStaticData('node');
		const returnData: INodeExecutionData[] = [];

		switch (event) {
				case 'newOrder':
				case 'orderFilled':
				case 'orderCanceled': {
					const instType = this.getNodeParameter('instType', '') as string;
					const instId = this.getNodeParameter('instId', '') as string;
					const query: IDataObject = {};
					if (instType) query.instType = instType;
					if (instId) query.instId = instId;

					const orders = await okxApiRequest.call(
						this,
						'GET',
						'/trade/orders-history',
						{},
						query,
					) as IDataObject[];

					const lastProcessedTime = webhookData.lastProcessedTime as string || '0';
					const newOrders = orders.filter((order) => {
						const orderTime = order.uTime as string || order.cTime as string;
						if (!orderTime) return false;
						
						// Filter by event type
						if (event === 'orderFilled' && order.state !== 'filled') return false;
						if (event === 'orderCanceled' && order.state !== 'canceled') return false;
						if (event === 'newOrder' && order.state !== 'live') return false;
						
						return orderTime > lastProcessedTime;
					});

					if (newOrders.length > 0) {
						const latestTime = newOrders.reduce((max, order) => {
							const orderTime = order.uTime as string || order.cTime as string;
							return orderTime > max ? orderTime : max;
						}, lastProcessedTime);
						webhookData.lastProcessedTime = latestTime;

						for (const order of newOrders) {
							returnData.push({ json: order });
						}
					}
					break;
				}

				case 'positionChanged': {
					const instType = this.getNodeParameter('instType', '') as string;
					const instId = this.getNodeParameter('instId', '') as string;
					const query: IDataObject = {};
					if (instType) query.instType = instType;
					if (instId) query.instId = instId;

					const positions = await okxApiRequest.call(
						this,
						'GET',
						'/account/positions',
						{},
						query,
					) as IDataObject[];

					const lastPositions = webhookData.lastPositions as IDataObject || {};
					const changedPositions: IDataObject[] = [];

					for (const position of positions) {
						const posId = position.posId as string;
						const currentPos = position.pos as string;
						const lastPos = lastPositions[posId] as string;

						if (lastPos === undefined || lastPos !== currentPos) {
							changedPositions.push({
								...position,
								previousPos: lastPos || '0',
								change: lastPos ? parseFloat(currentPos) - parseFloat(lastPos) : parseFloat(currentPos),
							});
							lastPositions[posId] = currentPos;
						}
					}

					webhookData.lastPositions = lastPositions;

					for (const position of changedPositions) {
						returnData.push({ json: position });
					}
					break;
				}

				case 'priceAlert': {
					const instId = this.getNodeParameter('instId', '') as string;
					const priceThreshold = this.getNodeParameter('priceThreshold', 0) as number;
					const priceDirection = this.getNodeParameter('priceDirection', 'above') as string;

					if (!instId) {
						throw new Error('Instrument ID is required for price alerts');
					}

					const ticker = await okxApiRequest.call(
						this,
						'GET',
						'/market/ticker',
						{},
						{ instId },
					) as IDataObject[];

					if (ticker.length > 0) {
						const currentPrice = parseFloat(ticker[0].last as string);
						const wasTriggered = webhookData.priceAlertTriggered as boolean || false;
						let shouldTrigger = false;

						if (priceDirection === 'above') {
							shouldTrigger = currentPrice > priceThreshold;
						} else {
							shouldTrigger = currentPrice < priceThreshold;
						}

						if (shouldTrigger && !wasTriggered) {
							webhookData.priceAlertTriggered = true;
							returnData.push({
								json: {
									...ticker[0],
									alertType: 'price',
									threshold: priceThreshold,
									direction: priceDirection,
									triggeredAt: new Date().toISOString(),
								},
							});
						} else if (!shouldTrigger) {
							webhookData.priceAlertTriggered = false;
						}
					}
					break;
				}

				case 'fundingRateAlert': {
					const instId = this.getNodeParameter('instId', '') as string;
					const fundingRateThreshold = this.getNodeParameter('fundingRateThreshold', 0.1) as number;

					if (!instId) {
						throw new Error('Instrument ID is required for funding rate alerts');
					}

					const fundingRate = await okxApiRequest.call(
						this,
						'GET',
						'/public/funding-rate',
						{},
						{ instId },
					) as IDataObject[];

					if (fundingRate.length > 0) {
						const currentRate = parseFloat(fundingRate[0].fundingRate as string) * 100;
						const wasTriggered = webhookData.fundingRateAlertTriggered as boolean || false;
						const shouldTrigger = Math.abs(currentRate) > fundingRateThreshold;

						if (shouldTrigger && !wasTriggered) {
							webhookData.fundingRateAlertTriggered = true;
							returnData.push({
								json: {
									...fundingRate[0],
									alertType: 'fundingRate',
									threshold: fundingRateThreshold,
									currentRatePercent: currentRate,
									triggeredAt: new Date().toISOString(),
								},
							});
						} else if (!shouldTrigger) {
							webhookData.fundingRateAlertTriggered = false;
						}
					}
					break;
				}

				case 'balanceChanged': {
					const ccy = this.getNodeParameter('ccy', '') as string;
					const balanceThreshold = this.getNodeParameter('balanceThreshold', 0) as number;
					const query: IDataObject = {};
					if (ccy) query.ccy = ccy;

					const balances = await okxApiRequest.call(
						this,
						'GET',
						'/account/balance',
						{},
						query,
					) as IDataObject[];

					if (balances.length > 0 && balances[0].details) {
						const details = balances[0].details as IDataObject[];
						const lastBalances = webhookData.lastBalances as IDataObject || {};
						const changedBalances: IDataObject[] = [];

						for (const detail of details) {
							const currency = detail.ccy as string;
							const currentBal = parseFloat(detail.cashBal as string);
							const lastBal = lastBalances[currency] as number;

							if (lastBal !== undefined) {
								const change = Math.abs(currentBal - lastBal);
								if (change > balanceThreshold) {
									changedBalances.push({
										...detail,
										previousBalance: lastBal,
										change: currentBal - lastBal,
									});
								}
							}
							lastBalances[currency] = currentBal;
						}

						webhookData.lastBalances = lastBalances;

						for (const balance of changedBalances) {
							returnData.push({ json: balance });
						}
					}
					break;
				}

				case 'algoOrderTriggered': {
					const instType = this.getNodeParameter('instType', '') as string;
					const query: IDataObject = { ordType: 'conditional' };
					if (instType) query.instType = instType;

					const algoOrders = await okxApiRequest.call(
						this,
						'GET',
						'/trade/orders-algo-history',
						{},
						{ ...query, state: 'effective' },
					) as IDataObject[];

					const lastProcessedTime = webhookData.lastAlgoProcessedTime as string || '0';
					const triggeredOrders = algoOrders.filter((order) => {
						const triggerTime = order.triggerTime as string;
						return triggerTime && triggerTime > lastProcessedTime;
					});

					if (triggeredOrders.length > 0) {
						const latestTime = triggeredOrders.reduce((max, order) => {
							const triggerTime = order.triggerTime as string;
							return triggerTime > max ? triggerTime : max;
						}, lastProcessedTime);
						webhookData.lastAlgoProcessedTime = latestTime;

						for (const order of triggeredOrders) {
							returnData.push({ json: order });
						}
					}
					break;
				}
			}

		if (returnData.length === 0) {
			return null;
		}

		return [returnData];
	}
}
