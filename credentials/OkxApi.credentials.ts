/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OkxApi implements ICredentialType {
	name = 'okxApi';
	displayName = 'OKX API';
	documentationUrl = 'https://www.okx.com/docs-v5/en/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your OKX API Key',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your OKX Secret Key',
		},
		{
			displayName: 'Passphrase',
			name: 'passphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your OKX API Passphrase (set when creating API key)',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Live Trading',
					value: 'live',
				},
				{
					name: 'Demo Trading',
					value: 'demo',
				},
			],
			default: 'live',
			description: 'Select trading environment. Demo mode uses simulated trading.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.okx.com',
			description: 'OKX API base URL',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v5/account/balance',
			method: 'GET',
		},
	};
}
