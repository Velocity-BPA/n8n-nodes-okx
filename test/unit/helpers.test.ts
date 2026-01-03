/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	simplifyResponse,
	buildQueryParams,
	buildRequestBody,
	validateInstId,
	formatTimestamp,
	parseNumericFields,
	getErrorMessage,
	getOkxErrorDescription,
} from '../../nodes/Okx/utils/helpers';

describe('Helpers', () => {
	describe('simplifyResponse', () => {
		it('should remove empty string values from object', () => {
			const input = { a: 'value', b: '', c: null, d: undefined };
			const result = simplifyResponse(input);
			expect(result).toEqual({ a: 'value' });
		});

		it('should handle arrays', () => {
			const input = [{ a: 'value', b: '' }, { c: 'test', d: null }];
			const result = simplifyResponse(input);
			expect(result).toEqual([{ a: 'value' }, { c: 'test' }]);
		});

		it('should handle nested objects', () => {
			const input = { a: { b: 'value', c: '' }, d: 'test' };
			const result = simplifyResponse(input);
			expect(result).toEqual({ a: { b: 'value' }, d: 'test' });
		});
	});

	describe('buildQueryParams', () => {
		it('should filter out empty values', () => {
			const params = { a: 'value', b: '', c: undefined, d: null };
			const result = buildQueryParams(params);
			expect(result).toEqual({ a: 'value' });
		});

		it('should convert values to strings', () => {
			const params = { a: 123, b: true };
			const result = buildQueryParams(params);
			expect(result).toEqual({ a: '123', b: 'true' });
		});
	});

	describe('buildRequestBody', () => {
		it('should filter out empty values', () => {
			const params = { a: 'value', b: '', c: undefined };
			const result = buildRequestBody(params);
			expect(result).toEqual({ a: 'value' });
		});

		it('should preserve non-string values', () => {
			const params = { a: 123, b: true, c: ['item'] };
			const result = buildRequestBody(params);
			expect(result).toEqual({ a: 123, b: true, c: ['item'] });
		});
	});

	describe('validateInstId', () => {
		it('should validate correct instrument IDs', () => {
			expect(validateInstId('BTC-USDT')).toBe(true);
			expect(validateInstId('BTC-USDT-SWAP')).toBe(true);
			expect(validateInstId('ETH-USD-240329')).toBe(true);
		});

		it('should reject invalid instrument IDs', () => {
			expect(validateInstId('BTC')).toBe(false);
			expect(validateInstId('BTC_USDT')).toBe(false);
			expect(validateInstId('')).toBe(false);
		});
	});

	describe('formatTimestamp', () => {
		it('should format string timestamp', () => {
			const result = formatTimestamp('1609459200000');
			expect(result).toBe('2021-01-01T00:00:00.000Z');
		});

		it('should format number timestamp', () => {
			const result = formatTimestamp(1609459200000);
			expect(result).toBe('2021-01-01T00:00:00.000Z');
		});
	});

	describe('parseNumericFields', () => {
		it('should parse specified fields as numbers', () => {
			const data = { price: '123.45', qty: '100', name: 'test' };
			const result = parseNumericFields(data, ['price', 'qty']);
			expect(result).toEqual({ price: 123.45, qty: 100, name: 'test' });
		});

		it('should handle invalid numbers', () => {
			const data = { price: 'invalid', qty: '100' };
			const result = parseNumericFields(data, ['price', 'qty']);
			expect(result).toEqual({ price: 'invalid', qty: 100 });
		});
	});

	describe('getErrorMessage', () => {
		it('should extract message from Error', () => {
			const error = new Error('Test error');
			expect(getErrorMessage(error)).toBe('Test error');
		});

		it('should return string as-is', () => {
			expect(getErrorMessage('Test error')).toBe('Test error');
		});

		it('should extract message from object', () => {
			expect(getErrorMessage({ message: 'Test' })).toBe('Test');
			expect(getErrorMessage({ msg: 'Test' })).toBe('Test');
		});

		it('should handle unknown error types', () => {
			expect(getErrorMessage(null)).toBe('Unknown error occurred');
			expect(getErrorMessage(123)).toBe('Unknown error occurred');
		});
	});

	describe('getOkxErrorDescription', () => {
		it('should return known error descriptions', () => {
			expect(getOkxErrorDescription('0')).toBe('Success');
			expect(getOkxErrorDescription('51001')).toBe('Instrument ID does not exist');
			expect(getOkxErrorDescription('51011')).toBe('Insufficient balance');
		});

		it('should return unknown error message for unknown codes', () => {
			expect(getOkxErrorDescription('99999')).toBe('Unknown error code: 99999');
		});
	});
});
