/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export type OkxInstrumentType = 'SPOT' | 'MARGIN' | 'SWAP' | 'FUTURES' | 'OPTION';
export type OkxTradeMode = 'cash' | 'cross' | 'isolated';
export type OkxOrderType = 'limit' | 'market' | 'post_only' | 'fok' | 'ioc';
export type OkxOrderSide = 'buy' | 'sell';
export type OkxPositionSide = 'long' | 'short' | 'net';
export type OkxAlgoOrderType = 'conditional' | 'oco' | 'trigger' | 'move_order_stop' | 'iceberg' | 'twap';
export type OkxMarginMode = 'cross' | 'isolated';
export type OkxPositionMode = 'long_short_mode' | 'net_mode';

export interface IOkxBalance {
	adjEq: string;
	details: IOkxBalanceDetail[];
	imr: string;
	isoEq: string;
	mgnRatio: string;
	mmr: string;
	notionalUsd: string;
	ordFroz: string;
	totalEq: string;
	uTime: string;
}

export interface IOkxBalanceDetail {
	availBal: string;
	availEq: string;
	cashBal: string;
	ccy: string;
	crossLiab: string;
	disEq: string;
	eq: string;
	eqUsd: string;
	frozenBal: string;
	interest: string;
	isoEq: string;
	isoLiab: string;
	isoUpl: string;
	liab: string;
	maxLoan: string;
	mgnRatio: string;
	notionalLever: string;
	ordFrozen: string;
	twap: string;
	uTime: string;
	upl: string;
	uplLiab: string;
	stgyEq: string;
	spotInUseAmt: string;
}

export interface IOkxPosition {
	adl: string;
	availPos: string;
	avgPx: string;
	cTime: string;
	ccy: string;
	deltaBS: string;
	deltaPA: string;
	gammaBS: string;
	gammaPA: string;
	imr: string;
	instId: string;
	instType: string;
	interest: string;
	last: string;
	lever: string;
	liab: string;
	liabCcy: string;
	liqPx: string;
	markPx: string;
	margin: string;
	mgnMode: string;
	mgnRatio: string;
	mmr: string;
	notionalUsd: string;
	optVal: string;
	pTime: string;
	pos: string;
	posCcy: string;
	posId: string;
	posSide: string;
	spotInUseAmt: string;
	spotInUseCcy: string;
	thetaBS: string;
	thetaPA: string;
	tradeId: string;
	uTime: string;
	upl: string;
	uplRatio: string;
	vegaBS: string;
	vegaPA: string;
}

export interface IOkxOrder {
	accFillSz: string;
	avgPx: string;
	cTime: string;
	category: string;
	ccy: string;
	clOrdId: string;
	fee: string;
	feeCcy: string;
	fillPx: string;
	fillSz: string;
	fillTime: string;
	instId: string;
	instType: string;
	lever: string;
	ordId: string;
	ordType: string;
	pnl: string;
	posSide: string;
	px: string;
	rebate: string;
	rebateCcy: string;
	reduceOnly: string;
	side: string;
	slOrdPx: string;
	slTriggerPx: string;
	slTriggerPxType: string;
	source: string;
	state: string;
	sz: string;
	tag: string;
	tdMode: string;
	tgtCcy: string;
	tpOrdPx: string;
	tpTriggerPx: string;
	tpTriggerPxType: string;
	tradeId: string;
	uTime: string;
}

export interface IOkxTicker {
	instType: string;
	instId: string;
	last: string;
	lastSz: string;
	askPx: string;
	askSz: string;
	bidPx: string;
	bidSz: string;
	open24h: string;
	high24h: string;
	low24h: string;
	volCcy24h: string;
	vol24h: string;
	ts: string;
	sodUtc0: string;
	sodUtc8: string;
}

export interface IOkxCandlestick {
	ts: string;
	o: string;
	h: string;
	l: string;
	c: string;
	vol: string;
	volCcy: string;
	volCcyQuote: string;
	confirm: string;
}

export interface IOkxTrade {
	instId: string;
	tradeId: string;
	px: string;
	sz: string;
	side: string;
	ts: string;
}

export interface IOkxInstrument {
	instType: string;
	instId: string;
	uly: string;
	instFamily: string;
	category: string;
	baseCcy: string;
	quoteCcy: string;
	settleCcy: string;
	ctVal: string;
	ctMult: string;
	ctValCcy: string;
	optType: string;
	stk: string;
	listTime: string;
	expTime: string;
	lever: string;
	tickSz: string;
	lotSz: string;
	minSz: string;
	ctType: string;
	alias: string;
	state: string;
}

export interface IOkxFundingRate {
	instType: string;
	instId: string;
	fundingRate: string;
	nextFundingRate: string;
	fundingTime: string;
	nextFundingTime: string;
}

export interface IOkxTransfer {
	transId: string;
	ccy: string;
	clientId: string;
	from: string;
	amt: string;
	to: string;
}

export interface IOkxDepositAddress {
	addr: string;
	tag: string;
	memo: string;
	pmtId: string;
	ccy: string;
	chain: string;
	ctAddr: string;
	selected: boolean;
}

export interface IOkxWithdrawal {
	ccy: string;
	chain: string;
	amt: string;
	ts: string;
	from: string;
	to: string;
	tag: string;
	pmtId: string;
	memo: string;
	state: string;
	wdId: string;
	fee: string;
	txId: string;
}

export interface IOkxAlgoOrder {
	algoId: string;
	algoClOrdId: string;
	instType: string;
	instId: string;
	ccy: string;
	ordId: string;
	sz: string;
	ordType: string;
	side: string;
	posSide: string;
	tdMode: string;
	tgtCcy: string;
	state: string;
	lever: string;
	tpTriggerPx: string;
	tpTriggerPxType: string;
	tpOrdPx: string;
	slTriggerPx: string;
	slTriggerPxType: string;
	slOrdPx: string;
	triggerPx: string;
	triggerPxType: string;
	ordPx: string;
	actualSz: string;
	actualPx: string;
	actualSide: string;
	pxVar: string;
	pxSpread: string;
	pxLimit: string;
	szLimit: string;
	tag: string;
	timeInterval: string;
	callbackRatio: string;
	callbackSpread: string;
	activePx: string;
	moveTriggerPx: string;
	cTime: string;
	triggerTime: string;
	reduceOnly: string;
}

export interface IOkxGridOrder {
	algoId: string;
	algoClOrdId: string;
	instType: string;
	instId: string;
	cTime: string;
	uTime: string;
	algoOrdType: string;
	state: string;
	rebateTrans: IDataObject[];
	triggerParams: IDataObject[];
	maxPx: string;
	minPx: string;
	gridNum: string;
	runType: string;
	tpTriggerPx: string;
	slTriggerPx: string;
	arbitrageNum: string;
	totalPnl: string;
	pnlRatio: string;
	investment: string;
	gridProfit: string;
	floatProfit: string;
	cancelType: string;
	stopType: string;
	quoteSz: string;
	baseSz: string;
	direction: string;
	basePos: boolean;
	sz: string;
	lever: string;
	actualLever: string;
	liqPx: string;
	uly: string;
}

export interface IOkxEarnOffer {
	ccy: string;
	productId: string;
	protocol: string;
	protocolType: string;
	term: string;
	apy: string;
	earlyRedeem: boolean;
	investData: IDataObject[];
	earningData: IDataObject[];
	state: string;
}

export interface IOkxCopyTrading {
	uniqueCode: string;
	nickName: string;
	portLink: string;
	pnl: string;
	pnlRatio: string;
	winRatio: string;
	tradeCount: string;
	aum: string;
	followCount: string;
	instType: string;
}
