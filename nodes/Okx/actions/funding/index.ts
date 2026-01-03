/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';
import { ACCOUNT_TYPES, TRANSFER_TYPES, SAVINGS_ACTION_TYPES } from '../../constants/options';

export const fundingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['funding'],
			},
		},
		options: [
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get funding account balance',
				action: 'Get balance',
			},
			{
				name: 'Get Bills',
				value: 'getBills',
				description: 'Get funding account bills',
				action: 'Get bills',
			},
			{
				name: 'Get Currencies',
				value: 'getCurrencies',
				description: 'Get supported currencies',
				action: 'Get currencies',
			},
			{
				name: 'Get Deposit Address',
				value: 'getDepositAddress',
				description: 'Get deposit address',
				action: 'Get deposit address',
			},
			{
				name: 'Get Deposit History',
				value: 'getDepositHistory',
				description: 'Get deposit records',
				action: 'Get deposit history',
			},
			{
				name: 'Get Lending History',
				value: 'getLendingHistory',
				description: 'Get lending history',
				action: 'Get lending history',
			},
			{
				name: 'Get Savings Balance',
				value: 'getSavingBalance',
				description: 'Get savings balance',
				action: 'Get saving balance',
			},
			{
				name: 'Get Transfer State',
				value: 'getTransferState',
				description: 'Get transfer status',
				action: 'Get transfer state',
			},
			{
				name: 'Get Withdrawal History',
				value: 'getWithdrawalHistory',
				description: 'Get withdrawal records',
				action: 'Get withdrawal history',
			},
			{
				name: 'Savings Purchase/Redemption',
				value: 'savingsPurchaseRedemption',
				description: 'Purchase or redeem from savings',
				action: 'Savings purchase redemption',
			},
			{
				name: 'Set Lending Rate',
				value: 'setLendingRate',
				description: 'Set lending rate',
				action: 'Set lending rate',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer between accounts',
				action: 'Transfer',
			},
			{
				name: 'Withdraw',
				value: 'withdraw',
				description: 'Withdraw funds',
				action: 'Withdraw',
			},
		],
		default: 'getBalance',
	},
];

export const fundingFields: INodeProperties[] = [
	// Currency field
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		description: 'Currency (e.g., BTC, USDT)',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['getBalance', 'getDepositAddress', 'getDepositHistory', 'getWithdrawalHistory', 'getBills', 'getSavingBalance', 'getLendingHistory'],
			},
		},
	},
	// Currency required
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		required: true,
		description: 'Currency (e.g., BTC, USDT)',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer', 'withdraw', 'savingsPurchaseRedemption', 'setLendingRate'],
			},
		},
	},
	// Transfer fields
	{
		displayName: 'Amount',
		name: 'amt',
		type: 'string',
		default: '',
		required: true,
		description: 'Amount to transfer/withdraw',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer', 'withdraw', 'savingsPurchaseRedemption'],
			},
		},
	},
	{
		displayName: 'From Account',
		name: 'from',
		type: 'options',
		options: ACCOUNT_TYPES,
		default: '6',
		required: true,
		description: 'Source account',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer'],
			},
		},
	},
	{
		displayName: 'To Account',
		name: 'to',
		type: 'options',
		options: ACCOUNT_TYPES,
		default: '18',
		required: true,
		description: 'Destination account',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer'],
			},
		},
	},
	{
		displayName: 'Transfer Type',
		name: 'type',
		type: 'options',
		options: TRANSFER_TYPES,
		default: '0',
		description: 'Transfer type',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer'],
			},
		},
	},
	{
		displayName: 'Sub-Account',
		name: 'subAcct',
		type: 'string',
		default: '',
		description: 'Sub-account name (required for sub-account transfers)',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['transfer'],
			},
		},
	},
	// Withdraw fields
	{
		displayName: 'Withdrawal Method',
		name: 'dest',
		type: 'options',
		options: [
			{ name: 'On-Chain', value: '4' },
			{ name: 'Internal Transfer', value: '3' },
		],
		default: '4',
		required: true,
		description: 'Withdrawal method',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['withdraw'],
			},
		},
	},
	{
		displayName: 'To Address',
		name: 'toAddr',
		type: 'string',
		default: '',
		required: true,
		description: 'Withdrawal address',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['withdraw'],
			},
		},
	},
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'string',
		default: '',
		required: true,
		description: 'Blockchain network (e.g., BTC-Bitcoin, ETH-ERC20)',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['withdraw', 'getDepositAddress'],
			},
		},
	},
	{
		displayName: 'Fee',
		name: 'fee',
		type: 'string',
		default: '',
		required: true,
		description: 'Withdrawal fee',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['withdraw'],
			},
		},
	},
	// Savings fields
	{
		displayName: 'Action',
		name: 'side',
		type: 'options',
		options: SAVINGS_ACTION_TYPES,
		default: 'purchase',
		required: true,
		description: 'Savings action',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['savingsPurchaseRedemption'],
			},
		},
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'string',
		default: '',
		required: true,
		description: 'Annual interest rate (e.g., 0.01 for 1%)',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['setLendingRate'],
			},
		},
	},
	// Transfer state field
	{
		displayName: 'Transfer ID',
		name: 'transId',
		type: 'string',
		default: '',
		required: true,
		description: 'Transfer ID to query',
		displayOptions: {
			show: {
				resource: ['funding'],
				operation: ['getTransferState'],
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
				resource: ['funding'],
				operation: ['getDepositHistory', 'getWithdrawalHistory', 'getBills', 'getLendingHistory'],
			},
		},
		options: [
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Status filter',
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

export async function executeFundingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCurrencies': {
			responseData = await okxApiRequest.call(this, 'GET', '/asset/currencies');
			break;
		}
		case 'getBalance': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/balances', {}, query);
			break;
		}
		case 'transfer': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const from = this.getNodeParameter('from', i) as string;
			const to = this.getNodeParameter('to', i) as string;
			const type = this.getNodeParameter('type', i, '0') as string;
			const subAcct = this.getNodeParameter('subAcct', i, '') as string;
			const body = buildRequestBody({ ccy, amt, from, to, type, subAcct });
			responseData = await okxApiRequest.call(this, 'POST', '/asset/transfer', body);
			break;
		}
		case 'getTransferState': {
			const transId = this.getNodeParameter('transId', i) as string;
			const query = buildQueryParams({ transId });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/transfer-state', {}, query);
			break;
		}
		case 'getBills': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/bills', {}, query);
			break;
		}
		case 'getDepositAddress': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const chain = this.getNodeParameter('chain', i, '') as string;
			const query = buildQueryParams({ ccy, chain });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/deposit-address', {}, query);
			break;
		}
		case 'getDepositHistory': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/deposit-history', {}, query);
			break;
		}
		case 'withdraw': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const dest = this.getNodeParameter('dest', i) as string;
			const toAddr = this.getNodeParameter('toAddr', i) as string;
			const chain = this.getNodeParameter('chain', i) as string;
			const fee = this.getNodeParameter('fee', i) as string;
			const body = buildRequestBody({ ccy, amt, dest, toAddr, chain, fee });
			responseData = await okxApiRequest.call(this, 'POST', '/asset/withdrawal', body);
			break;
		}
		case 'getWithdrawalHistory': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/withdrawal-history', {}, query);
			break;
		}
		case 'getSavingBalance': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const query = buildQueryParams({ ccy });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/saving-balance', {}, query);
			break;
		}
		case 'savingsPurchaseRedemption': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const body = buildRequestBody({ ccy, amt, side });
			responseData = await okxApiRequest.call(this, 'POST', '/asset/purchase_redempt', body);
			break;
		}
		case 'setLendingRate': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const rate = this.getNodeParameter('rate', i) as string;
			const body = buildRequestBody({ ccy, rate });
			responseData = await okxApiRequest.call(this, 'POST', '/asset/set-lending-rate', body);
			break;
		}
		case 'getLendingHistory': {
			const ccy = this.getNodeParameter('ccy', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams({ ccy, ...additionalFields });
			responseData = await okxApiRequest.call(this, 'GET', '/asset/lending-history', {}, query);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
