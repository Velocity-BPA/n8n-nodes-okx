/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IPollFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';

export interface IOkxCredentials {
	apiKey: string;
	secretKey: string;
	passphrase: string;
	environment: 'live' | 'demo';
	baseUrl: string;
}

export interface IOkxResponse {
	code: string;
	msg: string;
	data: IDataObject[];
}

function generateSignature(
	timestamp: string,
	method: string,
	requestPath: string,
	body: string,
	secretKey: string,
): string {
	const preHash = timestamp + method.toUpperCase() + requestPath + body;
	const hmac = crypto.createHmac('sha256', secretKey);
	hmac.update(preHash);
	return hmac.digest('base64');
}

function getTimestamp(): string {
	return new Date().toISOString();
}

export async function okxApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = (await this.getCredentials('okxApi')) as unknown as IOkxCredentials;

	const timestamp = getTimestamp();
	const baseUrl = credentials.baseUrl || 'https://www.okx.com';
	let requestPath = `/api/v5${endpoint}`;

	// Build query string
	const queryString = Object.keys(query).length > 0
		? '?' + new URLSearchParams(query as Record<string, string>).toString()
		: '';

	if (queryString) {
		requestPath += queryString;
	}

	// Prepare body string for signature
	const bodyString = method === 'GET' || Object.keys(body).length === 0
		? ''
		: JSON.stringify(body);

	// Generate signature
	const signature = generateSignature(
		timestamp,
		method,
		requestPath,
		bodyString,
		credentials.secretKey,
	);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${requestPath}`,
		headers: {
			'Content-Type': 'application/json',
			'OK-ACCESS-KEY': credentials.apiKey,
			'OK-ACCESS-SIGN': signature,
			'OK-ACCESS-TIMESTAMP': timestamp,
			'OK-ACCESS-PASSPHRASE': credentials.passphrase,
		},
		json: true,
	};

	// Add demo trading header if in demo mode
	if (credentials.environment === 'demo') {
		options.headers!['x-simulated-trading'] = '1';
	}

	// Add body for non-GET requests
	if (method !== 'GET' && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options) as IOkxResponse;

		// Check for OKX API errors
		if (response.code !== '0') {
			throw new NodeApiError(this.getNode(), {
				message: `OKX API Error: ${response.msg}`,
				description: `Error code: ${response.code}`,
			} as JsonObject);
		}

		return response.data;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function okxApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject[];

	do {
		responseData = (await okxApiRequest.call(
			this,
			method,
			endpoint,
			body,
			query,
		)) as IDataObject[];

		if (!Array.isArray(responseData)) {
			return [responseData];
		}

		returnData.push(...responseData);

		// Check if there's more data (OKX uses cursor-based pagination)
		if (responseData.length > 0) {
			const lastItem = responseData[responseData.length - 1];
			if (lastItem.after) {
				query.after = lastItem.after as string;
			} else if (lastItem.ts) {
				query.after = lastItem.ts as string;
			} else {
				break;
			}
		}

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (responseData.length > 0 && responseData.length >= 100);

	return returnData;
}
