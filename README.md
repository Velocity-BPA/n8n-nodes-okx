# n8n-nodes-okx

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for OKX, one of the world's top cryptocurrency exchanges by trading volume. This package provides complete access to OKX's V5 API, supporting spot, margin, futures, perpetual swaps, and options trading.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **Complete V5 API Coverage**: Access all OKX trading endpoints through a unified interface
- **Multi-Product Support**: Trade spot, margin, futures, perpetual swaps, and options
- **Advanced Trading**: Grid trading, copy trading, and algorithmic orders
- **Earn Products**: Staking, savings, and yield farming operations
- **Real-Time Triggers**: Poll-based triggers for order fills, price alerts, and position changes
- **Demo Trading**: Full support for OKX demo trading environment
- **Sub-Account Management**: Create and manage sub-accounts programmatically

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-okx`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-okx
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-okx.git
cd n8n-nodes-okx

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-okx

# Restart n8n
n8n start
```

## Credentials Setup

Create OKX API credentials in n8n with the following fields:

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your OKX API Key | Yes |
| Secret Key | Your OKX Secret Key | Yes |
| Passphrase | Your OKX API Passphrase | Yes |
| Environment | Live or Demo trading | Yes |
| Base URL | API base URL (default: https://www.okx.com) | No |

### Getting API Keys

1. Log in to your OKX account
2. Navigate to **Profile** > **API**
3. Click **Create API Key**
4. Set permissions based on your needs
5. **Important**: Save your Secret Key and Passphrase - they cannot be retrieved later

## Resources & Operations

### Account
- Get Balance, Positions, Position History
- Get/Set Account Configuration
- Set Position Mode, Leverage, Greeks Type
- Get Max Size, Available Size, Loan, Withdrawal
- Get Fee Rates, Interest Accrued/Rate

### Trade
- Place/Cancel/Amend Orders (single and batch)
- Close Positions
- Get Order Details, Open Orders, Order History
- Get Fills and Fill History
- Algo Orders: Conditional, OCO, Trigger, Iceberg, TWAP

### Market Data
- Get Tickers (single and all)
- Get Order Book, Candlesticks, Trades
- Get 24h Volume, Oracle Price, Exchange Rate
- Get Index/Mark Price Data

### Public Data
- Get Instruments, Open Interest
- Get Funding Rate and History
- Get Liquidation Orders, Price Limits
- Get Position Tiers, Insurance Fund

### Funding
- Get Currencies, Balances, Bills
- Transfer Between Accounts
- Deposit/Withdrawal Operations
- Savings and Lending

### Sub-Account
- List/Create Sub-Accounts
- Get Sub-Account Balances
- Transfer to/from Sub-Accounts
- API Key Management

### Grid Trading
- Place/Stop Grid Orders
- Get Grid Order List/History/Details
- Get Grid Sub-Orders, Positions
- Withdraw Grid Profits

### Copy Trading
- Get Lead Positions (current and history)
- Place/Close Leading Orders
- Get Lead Traders
- Configure Copy Trading Settings

### Earn
- Get Available Earn Products
- Purchase/Redeem Earn Products
- ETH and SOL Staking Operations

### Trading Statistics
- Get Taker Volume, Long/Short Ratio
- Get Open Interest and Volume
- Get Put/Call Ratio

### Utility
- Get Server Time
- Get Account Rate Limit Status

## Trigger Node

The OKX Trigger node supports poll-based monitoring for:

| Trigger | Description |
|---------|-------------|
| Order Filled | Triggered when an order is filled |
| Order Canceled | Triggered when an order is canceled |
| Position Changed | Triggered when position changes |
| Price Alert | Triggered when price crosses threshold |
| Balance Changed | Triggered when account balance changes |
| Algo Order Triggered | Triggered when algo order executes |

## Usage Examples

### Place a Spot Market Order

```json
{
  "resource": "trade",
  "operation": "placeOrder",
  "instId": "BTC-USDT",
  "tdMode": "cash",
  "side": "buy",
  "ordType": "market",
  "sz": "0.001"
}
```

### Create a Grid Trading Bot

```json
{
  "resource": "gridTrading",
  "operation": "placeGridOrder",
  "instId": "BTC-USDT",
  "algoOrdType": "grid",
  "maxPx": "50000",
  "minPx": "40000",
  "gridNum": 10,
  "runType": "1",
  "quoteSz": "1000"
}
```

### Get Account Balance

```json
{
  "resource": "account",
  "operation": "getBalance",
  "ccy": "USDT"
}
```

## OKX Concepts

| Concept | Description |
|---------|-------------|
| `instId` | Instrument ID (e.g., BTC-USDT, BTC-USDT-SWAP) |
| `instType` | SPOT, MARGIN, SWAP, FUTURES, OPTION |
| `tdMode` | Trade mode: cash, cross, isolated |
| `posSide` | Position side: long, short, net |
| `ordType` | Order type: limit, market, post_only, fok, ioc |
| `clOrdId` | Client-assigned order ID |
| `algoId` | Algo order ID |

## Error Handling

The node provides detailed error messages from OKX API:

```json
{
  "code": "51001",
  "msg": "Instrument ID does not exist"
}
```

Common error codes:
- `51001`: Invalid instrument ID
- `51011`: Insufficient balance
- `51020`: Order status changed
- `50011`: Rate limit reached

## Security Best Practices

1. **API Key Permissions**: Only enable required permissions
2. **IP Whitelisting**: Restrict API access to specific IPs
3. **Demo Trading**: Test strategies in demo mode first
4. **Rate Limits**: Implement appropriate delays between requests
5. **Credential Storage**: Use n8n's encrypted credential storage

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/Velocity-BPA/n8n-nodes-okx/issues)
- Documentation: [OKX API Docs](https://www.okx.com/docs-v5/en/)
- Email: support@velobpa.com

## Acknowledgments

- [OKX](https://www.okx.com) for their comprehensive API documentation
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for inspiration and support
