/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const INSTRUMENT_TYPES: INodePropertyOptions[] = [
	{ name: 'Spot', value: 'SPOT' },
	{ name: 'Margin', value: 'MARGIN' },
	{ name: 'Swap (Perpetual)', value: 'SWAP' },
	{ name: 'Futures', value: 'FUTURES' },
	{ name: 'Option', value: 'OPTION' },
];

export const TRADE_MODES: INodePropertyOptions[] = [
	{ name: 'Cash (Spot)', value: 'cash' },
	{ name: 'Cross Margin', value: 'cross' },
	{ name: 'Isolated Margin', value: 'isolated' },
];

export const ORDER_TYPES: INodePropertyOptions[] = [
	{ name: 'Limit', value: 'limit' },
	{ name: 'Market', value: 'market' },
	{ name: 'Post Only', value: 'post_only' },
	{ name: 'Fill or Kill (FOK)', value: 'fok' },
	{ name: 'Immediate or Cancel (IOC)', value: 'ioc' },
];

export const ORDER_SIDES: INodePropertyOptions[] = [
	{ name: 'Buy', value: 'buy' },
	{ name: 'Sell', value: 'sell' },
];

export const POSITION_SIDES: INodePropertyOptions[] = [
	{ name: 'Long', value: 'long' },
	{ name: 'Short', value: 'short' },
	{ name: 'Net', value: 'net' },
];

export const POSITION_MODES: INodePropertyOptions[] = [
	{ name: 'Long/Short Mode', value: 'long_short_mode' },
	{ name: 'Net Mode', value: 'net_mode' },
];

export const ALGO_ORDER_TYPES: INodePropertyOptions[] = [
	{ name: 'Conditional', value: 'conditional' },
	{ name: 'OCO (One Cancels Other)', value: 'oco' },
	{ name: 'Trigger', value: 'trigger' },
	{ name: 'Trailing Stop', value: 'move_order_stop' },
	{ name: 'Iceberg', value: 'iceberg' },
	{ name: 'TWAP', value: 'twap' },
];

export const MARGIN_MODES: INodePropertyOptions[] = [
	{ name: 'Cross', value: 'cross' },
	{ name: 'Isolated', value: 'isolated' },
];

export const CANDLESTICK_BARS: INodePropertyOptions[] = [
	{ name: '1 Minute', value: '1m' },
	{ name: '3 Minutes', value: '3m' },
	{ name: '5 Minutes', value: '5m' },
	{ name: '15 Minutes', value: '15m' },
	{ name: '30 Minutes', value: '30m' },
	{ name: '1 Hour', value: '1H' },
	{ name: '2 Hours', value: '2H' },
	{ name: '4 Hours', value: '4H' },
	{ name: '6 Hours', value: '6H' },
	{ name: '12 Hours', value: '12H' },
	{ name: '1 Day', value: '1D' },
	{ name: '1 Week', value: '1W' },
	{ name: '1 Month', value: '1M' },
	{ name: '3 Months', value: '3M' },
];

export const ACCOUNT_TYPES: INodePropertyOptions[] = [
	{ name: 'Trading', value: '18' },
	{ name: 'Funding', value: '6' },
];

export const TRANSFER_TYPES: INodePropertyOptions[] = [
	{ name: 'Within Account', value: '0' },
	{ name: 'Master to Sub-Account', value: '1' },
	{ name: 'Sub-Account to Master', value: '2' },
];

export const GRID_ALGO_TYPES: INodePropertyOptions[] = [
	{ name: 'Spot Grid', value: 'grid' },
	{ name: 'Contract Grid', value: 'contract_grid' },
	{ name: 'Moon Grid', value: 'moon_grid' },
];

export const GRID_RUN_TYPES: INodePropertyOptions[] = [
	{ name: 'Arithmetic', value: '1' },
	{ name: 'Geometric', value: '2' },
];

export const TRIGGER_PRICE_TYPES: INodePropertyOptions[] = [
	{ name: 'Last Price', value: 'last' },
	{ name: 'Index Price', value: 'index' },
	{ name: 'Mark Price', value: 'mark' },
];

export const GREEKS_TYPES: INodePropertyOptions[] = [
	{ name: 'Greeks in Coins', value: 'PA' },
	{ name: 'Black-Scholes Greeks in Dollars', value: 'BS' },
];

export const ORDER_BOOK_DEPTHS: INodePropertyOptions[] = [
	{ name: '1', value: '1' },
	{ name: '5', value: '5' },
	{ name: '10', value: '10' },
	{ name: '20', value: '20' },
	{ name: '50', value: '50' },
	{ name: '100', value: '100' },
	{ name: '400', value: '400' },
];

export const SAVINGS_ACTION_TYPES: INodePropertyOptions[] = [
	{ name: 'Purchase', value: 'purchase' },
	{ name: 'Redemption', value: 'redempt' },
];
