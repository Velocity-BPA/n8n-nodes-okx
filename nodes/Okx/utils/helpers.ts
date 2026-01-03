/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

export function simplifyResponse(data: IDataObject | IDataObject[]): IDataObject | IDataObject[] {
	if (Array.isArray(data)) {
		return data.map((item) => simplifyObject(item));
	}
	return simplifyObject(data);
}

function simplifyObject(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== '' && value !== null && value !== undefined) {
			if (typeof value === 'object' && !Array.isArray(value)) {
				result[key] = simplifyObject(value as IDataObject);
			} else if (Array.isArray(value)) {
				result[key] = value.map((item) =>
					typeof item === 'object' ? simplifyObject(item as IDataObject) : item,
				);
			} else {
				result[key] = value;
			}
		}
	}
	return result;
}

export function prepareOutput(
	data: IDataObject | IDataObject[],
	simplify: boolean,
): INodeExecutionData[] {
	const items = Array.isArray(data) ? data : [data];
	const processedItems = simplify ? (simplifyResponse(items) as IDataObject[]) : items;
	return processedItems.map((item) => ({ json: item }));
}

export function buildQueryParams(params: IDataObject): IDataObject {
	const query: IDataObject = {};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			query[key] = String(value);
		}
	}
	return query;
}

export function buildRequestBody(params: IDataObject): IDataObject {
	const body: IDataObject = {};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			body[key] = value;
		}
	}
	return body;
}

export function validateInstId(instId: string): boolean {
	// OKX instrument IDs follow pattern: BASE-QUOTE or BASE-QUOTE-SUFFIX
	const pattern = /^[A-Z0-9]+-[A-Z0-9]+(-[A-Z0-9]+)?$/i;
	return pattern.test(instId);
}

export function formatTimestamp(ts: string | number): string {
	const timestamp = typeof ts === 'string' ? parseInt(ts, 10) : ts;
	return new Date(timestamp).toISOString();
}

export function parseNumericFields(
	data: IDataObject,
	fields: string[],
): IDataObject {
	const result = { ...data };
	for (const field of fields) {
		if (result[field] !== undefined && result[field] !== '') {
			const value = parseFloat(result[field] as string);
			if (!isNaN(value)) {
				result[field] = value;
			}
		}
	}
	return result;
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === 'string') {
		return error;
	}
	if (typeof error === 'object' && error !== null) {
		const errorObj = error as IDataObject;
		if (errorObj.message) {
			return String(errorObj.message);
		}
		if (errorObj.msg) {
			return String(errorObj.msg);
		}
	}
	return 'Unknown error occurred';
}

export const OKX_ERROR_CODES: Record<string, string> = {
	'0': 'Success',
	'1': 'Operation failed',
	'2': 'Bulk operation partially succeeded',
	'50000': 'Body cannot be empty',
	'50001': 'Service temporarily unavailable',
	'50002': 'JSON data format error',
	'50004': 'Endpoint request timeout',
	'50005': 'API is offline or unavailable',
	'50006': 'Invalid Content-Type',
	'50007': 'Account blocked',
	'50008': 'User does not exist',
	'50009': 'Account is suspended',
	'50010': 'User ID cannot be empty',
	'50011': 'Rate limit reached',
	'50012': 'Account status invalid',
	'50013': 'System is busy',
	'50014': 'Parameter cannot be empty',
	'50100': 'API frozen',
	'50101': 'Broker ID does not exist',
	'50102': 'Broker domain does not exist',
	'50103': 'Broker ID not matched',
	'50104': 'Endpoint not supported for broker',
	'50105': 'Broker permission error',
	'50106': 'Broker ID does not match current environment',
	'50107': 'Broker id not matched',
	'50108': 'Broker domain not matched',
	'50109': 'Broker not found',
	'50110': 'Broker account not exist or not available',
	'50111': 'Api key does not exist',
	'50112': 'Api key does not match environment',
	'50113': 'IP does not match',
	'50114': 'Invalid signature',
	'50115': 'Invalid request timestamp',
	'51000': 'Parameter error',
	'51001': 'Instrument ID does not exist',
	'51002': 'Instrument ID does not match',
	'51003': 'Invalid action',
	'51004': 'Account does not exist',
	'51005': 'Order does not exist',
	'51006': 'Position does not exist',
	'51007': 'Currency does not exist',
	'51008': 'Order already exists',
	'51009': 'Order size exceeds limit',
	'51010': 'Order price exceeds limit',
	'51011': 'Insufficient balance',
	'51012': 'Position does not exist for closing',
	'51020': 'Order status changed',
	'51021': 'Order completely filled',
	'51022': 'Order not found',
	'51023': 'Invalid order type',
	'51024': 'Invalid order side',
	'51025': 'Order size is less than minimum',
	'51026': 'Order size is greater than maximum',
	'51100': 'Trading disabled',
	'51101': 'Market closed',
	'51102': 'Position frozen',
	'51103': 'Closing only',
	'51104': 'Order only mode',
	'51110': 'System error',
	'51111': 'System busy',
	'51112': 'Database error',
	'51113': 'Service unavailable',
	'51200': 'Margin call',
	'51201': 'Insufficient margin',
	'51202': 'Risk limit exceeded',
	'51203': 'Position limit exceeded',
	'51204': 'Leverage exceeds limit',
	'51300': 'Algo order not exist',
	'51301': 'Algo order type error',
	'51302': 'Algo order state error',
	'51303': 'Algo order param error',
	'51400': 'Withdrawal to internal address',
	'51401': 'Withdrawal amount too small',
	'51402': 'Withdrawal amount too large',
	'51403': 'Insufficient withdrawal balance',
	'51404': 'Withdrawal address not in whitelist',
	'51405': 'Invalid withdrawal address',
	'51406': 'Withdrawal chain not match',
	'51500': 'Sub-account does not exist',
	'51501': 'Sub-account transfer error',
	'51502': 'Sub-account permission error',
	'51503': 'Sub-account API key error',
};

export function getOkxErrorDescription(code: string): string {
	return OKX_ERROR_CODES[code] || `Unknown error code: ${code}`;
}
