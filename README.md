# RevCoin

RevCoin is a blockchain-based application for managing cryptocurrency transactions. This project includes user registration, login, transaction creation, and mining transactions into blocks.

## Prerequisites

- Node.js
- MongoDB
- PubNub account

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/G-jacobsson/RevCoin.git
   cd revcoin
   ```

2. Install dependencies

```
npm install
```

3. Create a .env file in the root directory of the server and add the following:

PORT=5001
DIFFICULTY=2
MINE_RATE=2000
NODE_ENV=development
DYNAMIC_NODE_PORT=false

INITIAL_WALLET_BALANCE=1000

MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_TTL=30d
JWT_COOKIE_TTL=30

PUBNUB_PUBLISH_KEY=your_pubnub_publish_key
PUBNUB_SUBSCRIBE_KEY=your_pubnub_subscribe_key
PUBNUB_SECRET_KEY=your_pubnub_secret_key
PUBNUB_UUID=your_pubnub_uuid

## Running the application

1. Start the server and the client

```
cd RevCoin-Server
npm run dev
```

```
cd RevCoin-Client
npm run dev
```

To run a new node with dynamic port:

```
cd RevCoin-Server
npm run dev-node
```

$$
{\color{red}
Attention! New node will sync with primary node on startup and also following transactions + blocks made on network.

Dropdown with nodes in the works but for now check output in terminal.
}
$$

## API Endpoints

- POST /api/v1/RevCoin/auth/register: Register a new user.

- POST /api/v1/RevCoin/auth/login: Log in an existing user.

- POST /api/v1/RevCoin/transactions/create: Create a new transaction.

- POST /api/v1/RevCoin/blockchain/mine: Mine pending transactions into a new block.

- GET /api/v1/RevCoin/transactions: Fetch all transactions.

- GET /api/v1/RevCoin/blockchain: Fetch the blockchain.

## Frontend

The frontend of the application includes pages for user registration, login, and managing transactions. Ensure you have a frontend setup that connects to these endpoints and displays the necessary data.

## Security Middleware

The application uses the following security middleware:

- helmet: Adds security headers.
- xss-clean: Prevents Cross-Site Scripting (XSS) attacks.
- express-rate-limit: Limits the number of requests to prevent DDoS attacks.
- hpp: Prevents HTTP Parameter Pollution attacks.
- cors: Enables Cross-Origin Resource Sharing.

These are already configured in the server setup. Ensure you have installed all necessary packages.

## License

This project is licensed under the ISC License.
