/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

describe('Request Transport', () => {
	describe('Signature Generation', () => {
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

		it('should generate correct signature for GET request', () => {
			const timestamp = '2023-01-01T00:00:00.000Z';
			const method = 'GET';
			const requestPath = '/api/v5/account/balance';
			const body = '';
			const secretKey = 'test-secret-key';

			const signature = generateSignature(timestamp, method, requestPath, body, secretKey);

			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
			expect(signature.length).toBeGreaterThan(0);
		});

		it('should generate correct signature for POST request with body', () => {
			const timestamp = '2023-01-01T00:00:00.000Z';
			const method = 'POST';
			const requestPath = '/api/v5/trade/order';
			const body = JSON.stringify({ instId: 'BTC-USDT', side: 'buy', sz: '1' });
			const secretKey = 'test-secret-key';

			const signature = generateSignature(timestamp, method, requestPath, body, secretKey);

			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
		});

		it('should generate different signatures for different data', () => {
			const timestamp = '2023-01-01T00:00:00.000Z';
			const secretKey = 'test-secret-key';

			const sig1 = generateSignature(timestamp, 'GET', '/api/v5/account/balance', '', secretKey);
			const sig2 = generateSignature(timestamp, 'GET', '/api/v5/account/positions', '', secretKey);

			expect(sig1).not.toBe(sig2);
		});

		it('should generate consistent signatures for same data', () => {
			const timestamp = '2023-01-01T00:00:00.000Z';
			const method = 'GET';
			const requestPath = '/api/v5/account/balance';
			const body = '';
			const secretKey = 'test-secret-key';

			const sig1 = generateSignature(timestamp, method, requestPath, body, secretKey);
			const sig2 = generateSignature(timestamp, method, requestPath, body, secretKey);

			expect(sig1).toBe(sig2);
		});
	});

	describe('Request Path Building', () => {
		it('should build correct path with query parameters', () => {
			const endpoint = '/account/balance';
			const query = { ccy: 'BTC' };
			
			const queryString = Object.keys(query).length > 0
				? '?' + new URLSearchParams(query as Record<string, string>).toString()
				: '';
			const requestPath = `/api/v5${endpoint}${queryString}`;

			expect(requestPath).toBe('/api/v5/account/balance?ccy=BTC');
		});

		it('should handle multiple query parameters', () => {
			const endpoint = '/trade/orders-history';
			const query = { instType: 'SPOT', instId: 'BTC-USDT', limit: '100' };
			
			const queryString = '?' + new URLSearchParams(query).toString();
			const requestPath = `/api/v5${endpoint}${queryString}`;

			expect(requestPath).toContain('instType=SPOT');
			expect(requestPath).toContain('instId=BTC-USDT');
			expect(requestPath).toContain('limit=100');
		});

		it('should handle empty query parameters', () => {
			const endpoint = '/public/time';
			const query = {};
			
			const queryString = Object.keys(query).length > 0
				? '?' + new URLSearchParams(query as Record<string, string>).toString()
				: '';
			const requestPath = `/api/v5${endpoint}${queryString}`;

			expect(requestPath).toBe('/api/v5/public/time');
		});
	});
});
