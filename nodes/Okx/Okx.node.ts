/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { accountOperations, accountFields, executeAccountOperation } from './actions/account';
import { tradeOperations, tradeFields, executeTradeOperation } from './actions/trade';
import { marketDataOperations, marketDataFields, executeMarketDataOperation } from './actions/marketData';
import { publicDataOperations, publicDataFields, executePublicDataOperation } from './actions/publicData';
import { fundingOperations, fundingFields, executeFundingOperation } from './actions/funding';
import { subAccountOperations, subAccountFields, executeSubAccountOperation } from './actions/subAccount';
import { gridTradingOperations, gridTradingFields, executeGridTradingOperation } from './actions/gridTrading';
import { copyTradingOperations, copyTradingFields, executeCopyTradingOperation } from './actions/copyTrading';
import { earnOperations, earnFields, executeEarnOperation } from './actions/earn';
import { tradingStatsOperations, tradingStatsFields, executeTradingStatsOperation } from './actions/tradingStats';
import { utilityOperations, utilityFields, executeUtilityOperation } from './actions/utility';
import { prepareOutput } from './utils/helpers';

// Runtime licensing notice (logged once per node load)
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeLogged = false;

export class Okx implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OKX',
		name: 'okx',
		icon: 'file:okx.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with OKX cryptocurrency exchange API',
		defaults: {
			name: 'OKX',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'okxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Copy Trading',
						value: 'copyTrading',
					},
					{
						name: 'Earn',
						value: 'earn',
					},
					{
						name: 'Funding',
						value: 'funding',
					},
					{
						name: 'Grid Trading',
						value: 'gridTrading',
					},
					{
						name: 'Market Data',
						value: 'marketData',
					},
					{
						name: 'Public Data',
						value: 'publicData',
					},
					{
						name: 'Sub-Account',
						value: 'subAccount',
					},
					{
						name: 'Trade',
						value: 'trade',
					},
					{
						name: 'Trading Stats',
						value: 'tradingStats',
					},
					{
						name: 'Utility',
						value: 'utility',
					},
				],
				default: 'account',
			},
			// Account operations and fields
			...accountOperations,
			...accountFields,
			// Trade operations and fields
			...tradeOperations,
			...tradeFields,
			// Market Data operations and fields
			...marketDataOperations,
			...marketDataFields,
			// Public Data operations and fields
			...publicDataOperations,
			...publicDataFields,
			// Funding operations and fields
			...fundingOperations,
			...fundingFields,
			// Sub-Account operations and fields
			...subAccountOperations,
			...subAccountFields,
			// Grid Trading operations and fields
			...gridTradingOperations,
			...gridTradingFields,
			// Copy Trading operations and fields
			...copyTradingOperations,
			...copyTradingFields,
			// Earn operations and fields
			...earnOperations,
			...earnFields,
			// Trading Stats operations and fields
			...tradingStatsOperations,
			...tradingStatsFields,
			// Utility operations and fields
			...utilityOperations,
			...utilityFields,
			// Simplify output option
			{
				displayName: 'Simplify',
				name: 'simplify',
				type: 'boolean',
				default: true,
				description: 'Whether to return a simplified version of the response instead of the raw data',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licenseNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licenseNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const simplify = this.getNodeParameter('simplify', 0, true) as boolean;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				switch (resource) {
					case 'account':
						responseData = await executeAccountOperation.call(this, operation, i);
						break;
					case 'trade':
						responseData = await executeTradeOperation.call(this, operation, i);
						break;
					case 'marketData':
						responseData = await executeMarketDataOperation.call(this, operation, i);
						break;
					case 'publicData':
						responseData = await executePublicDataOperation.call(this, operation, i);
						break;
					case 'funding':
						responseData = await executeFundingOperation.call(this, operation, i);
						break;
					case 'subAccount':
						responseData = await executeSubAccountOperation.call(this, operation, i);
						break;
					case 'gridTrading':
						responseData = await executeGridTradingOperation.call(this, operation, i);
						break;
					case 'copyTrading':
						responseData = await executeCopyTradingOperation.call(this, operation, i);
						break;
					case 'earn':
						responseData = await executeEarnOperation.call(this, operation, i);
						break;
					case 'tradingStats':
						responseData = await executeTradingStatsOperation.call(this, operation, i);
						break;
					case 'utility':
						responseData = await executeUtilityOperation.call(this, operation, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				const executionData = prepareOutput(responseData, simplify);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
