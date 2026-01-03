/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';
import { buildQueryParams, buildRequestBody } from '../../utils/helpers';

export const subAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subAccount'],
			},
		},
		options: [
			{
				name: 'Create Sub-Account',
				value: 'createSubAccount',
				description: 'Create a new sub-account',
				action: 'Create sub account',
			},
			{
				name: 'Create Sub-Account API Key',
				value: 'createSubAccountAPIKey',
				description: 'Create API key for sub-account',
				action: 'Create sub account api key',
			},
			{
				name: 'Delete Sub-Account API Key',
				value: 'deleteSubAccountAPIKey',
				description: 'Delete sub-account API key',
				action: 'Delete sub account api key',
			},
			{
				name: 'Get Sub-Account API Key',
				value: 'getSubAccountAPIKey',
				description: 'Get sub-account API key information',
				action: 'Get sub account api key',
			},
			{
				name: 'Get Sub-Account Balance',
				value: 'getSubAccountBalance',
				description: 'Get sub-account balance',
				action: 'Get sub account balance',
			},
			{
				name: 'Get Sub-Account Bills',
				value: 'getSubAccountBills',
				description: 'Get sub-account bills history',
				action: 'Get sub account bills',
			},
			{
				name: 'Get Sub-Account List',
				value: 'getSubAccountList',
				description: 'Get list of sub-accounts',
				action: 'Get sub account list',
			},
			{
				name: 'Get Sub-Account Transfer History',
				value: 'getSubAccountTransferHistory',
				description: 'Get sub-account transfer history',
				action: 'Get sub account transfer history',
			},
			{
				name: 'Reset Sub-Account API Key',
				value: 'resetSubAccountAPIKey',
				description: 'Reset sub-account API key',
				action: 'Reset sub account api key',
			},
			{
				name: 'Transfer to Sub-Account',
				value: 'transferToSubAccount',
				description: 'Transfer funds to/from sub-account',
				action: 'Transfer to sub account',
			},
		],
		default: 'getSubAccountList',
	},
];

export const subAccountFields: INodeProperties[] = [
	// Sub-account name
	{
		displayName: 'Sub-Account Name',
		name: 'subAcct',
		type: 'string',
		default: '',
		required: true,
		description: 'Sub-account name',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['getSubAccountBalance', 'transferToSubAccount', 'createSubAccountAPIKey', 'getSubAccountAPIKey', 'resetSubAccountAPIKey', 'deleteSubAccountAPIKey'],
			},
		},
	},
	// Create Sub-Account fields
	{
		displayName: 'Sub-Account Name',
		name: 'subAcct',
		type: 'string',
		default: '',
		required: true,
		description: 'Sub-account name (6-20 characters)',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccount'],
			},
		},
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		description: 'Sub-account label',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccount'],
			},
		},
	},
	// Transfer fields
	{
		displayName: 'Currency',
		name: 'ccy',
		type: 'string',
		default: '',
		required: true,
		description: 'Currency to transfer',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amt',
		type: 'string',
		default: '',
		required: true,
		description: 'Amount to transfer',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	{
		displayName: 'From Account',
		name: 'from',
		type: 'options',
		options: [
			{ name: 'Funding', value: '6' },
			{ name: 'Trading', value: '18' },
		],
		default: '6',
		required: true,
		description: 'Source account type',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	{
		displayName: 'To Account',
		name: 'to',
		type: 'options',
		options: [
			{ name: 'Funding', value: '6' },
			{ name: 'Trading', value: '18' },
		],
		default: '6',
		required: true,
		description: 'Destination account type',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	{
		displayName: 'From Sub-Account',
		name: 'fromSubAccount',
		type: 'string',
		default: '',
		description: 'Source sub-account (leave empty for master)',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	{
		displayName: 'To Sub-Account',
		name: 'toSubAccount',
		type: 'string',
		default: '',
		description: 'Destination sub-account (leave empty for master)',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['transferToSubAccount'],
			},
		},
	},
	// API Key fields
	{
		displayName: 'API Key',
		name: 'apiKey',
		type: 'string',
		default: '',
		description: 'Sub-account API key',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['getSubAccountAPIKey', 'resetSubAccountAPIKey', 'deleteSubAccountAPIKey'],
			},
		},
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		required: true,
		description: 'API key label',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountAPIKey'],
			},
		},
	},
	{
		displayName: 'Passphrase',
		name: 'passphrase',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		description: 'API key passphrase',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountAPIKey'],
			},
		},
	},
	{
		displayName: 'Permissions',
		name: 'perm',
		type: 'multiOptions',
		options: [
			{ name: 'Read Only', value: 'read_only' },
			{ name: 'Trade', value: 'trade' },
			{ name: 'Withdraw', value: 'withdraw' },
		],
		default: ['read_only'],
		description: 'API key permissions',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountAPIKey', 'resetSubAccountAPIKey'],
			},
		},
	},
	{
		displayName: 'IP Addresses',
		name: 'ip',
		type: 'string',
		default: '',
		description: 'Linked IP addresses (comma-separated)',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountAPIKey', 'resetSubAccountAPIKey'],
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
				resource: ['subAccount'],
				operation: ['getSubAccountList', 'getSubAccountBills', 'getSubAccountTransferHistory'],
			},
		},
		options: [
			{
				displayName: 'Enable',
				name: 'enable',
				type: 'boolean',
				default: true,
				description: 'Filter by enabled status',
			},
			{
				displayName: 'Sub-Account',
				name: 'subAcct',
				type: 'string',
				default: '',
				description: 'Filter by sub-account name',
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

export async function executeSubAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getSubAccountList': {
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams(additionalFields);
			responseData = await okxApiRequest.call(this, 'GET', '/users/subaccount/list', {}, query);
			break;
		}
		case 'getSubAccountBalance': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const query = buildQueryParams({ subAcct });
			responseData = await okxApiRequest.call(this, 'GET', '/account/subaccount/balances', {}, query);
			break;
		}
		case 'getSubAccountBills': {
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams(additionalFields);
			responseData = await okxApiRequest.call(this, 'GET', '/asset/subaccount/bills', {}, query);
			break;
		}
		case 'transferToSubAccount': {
			const ccy = this.getNodeParameter('ccy', i) as string;
			const amt = this.getNodeParameter('amt', i) as string;
			const from = this.getNodeParameter('from', i) as string;
			const to = this.getNodeParameter('to', i) as string;
			const fromSubAccount = this.getNodeParameter('fromSubAccount', i, '') as string;
			const toSubAccount = this.getNodeParameter('toSubAccount', i, '') as string;
			const body = buildRequestBody({
				ccy,
				amt,
				from,
				to,
				fromSubAccount,
				toSubAccount,
				type: fromSubAccount || toSubAccount ? '2' : '0',
			});
			responseData = await okxApiRequest.call(this, 'POST', '/asset/subaccount/transfer', body);
			break;
		}
		case 'getSubAccountTransferHistory': {
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			const query = buildQueryParams(additionalFields);
			responseData = await okxApiRequest.call(this, 'GET', '/asset/subaccount/bills', {}, query);
			break;
		}
		case 'createSubAccount': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const label = this.getNodeParameter('label', i, '') as string;
			const body = buildRequestBody({ subAcct, label });
			responseData = await okxApiRequest.call(this, 'POST', '/users/subaccount/create', body);
			break;
		}
		case 'createSubAccountAPIKey': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const label = this.getNodeParameter('label', i) as string;
			const passphrase = this.getNodeParameter('passphrase', i) as string;
			const perm = (this.getNodeParameter('perm', i) as string[]).join(',');
			const ip = this.getNodeParameter('ip', i, '') as string;
			const body = buildRequestBody({ subAcct, label, passphrase, perm, ip });
			responseData = await okxApiRequest.call(this, 'POST', '/users/subaccount/apikey', body);
			break;
		}
		case 'getSubAccountAPIKey': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i, '') as string;
			const query = buildQueryParams({ subAcct, apiKey });
			responseData = await okxApiRequest.call(this, 'GET', '/users/subaccount/apikey', {}, query);
			break;
		}
		case 'resetSubAccountAPIKey': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const perm = (this.getNodeParameter('perm', i) as string[]).join(',');
			const ip = this.getNodeParameter('ip', i, '') as string;
			const body = buildRequestBody({ subAcct, apiKey, perm, ip });
			responseData = await okxApiRequest.call(this, 'POST', '/users/subaccount/modify-apikey', body);
			break;
		}
		case 'deleteSubAccountAPIKey': {
			const subAcct = this.getNodeParameter('subAcct', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const body = buildRequestBody({ subAcct, apiKey });
			responseData = await okxApiRequest.call(this, 'POST', '/users/subaccount/delete-apikey', body);
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
