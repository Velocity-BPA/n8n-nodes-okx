/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { okxApiRequest } from '../../transport/request';

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get Account Rate Limit',
				value: 'getAccountRateLimit',
				description: 'Get account rate limit status',
				action: 'Get account rate limit',
			},
			{
				name: 'Get Server Time',
				value: 'getServerTime',
				description: 'Get OKX server time',
				action: 'Get server time',
			},
		],
		default: 'getServerTime',
	},
];

export const utilityFields: INodeProperties[] = [];

export async function executeUtilityOperation(
	this: IExecuteFunctions,
	operation: string,
	_i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getServerTime': {
			responseData = await okxApiRequest.call(this, 'GET', '/public/time');
			break;
		}
		case 'getAccountRateLimit': {
			responseData = await okxApiRequest.call(this, 'GET', '/account/rate-limit');
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
