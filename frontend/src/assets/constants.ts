import { PublicKey } from '@solana/web3.js';

const constants = {
    PROGRAM_ID: new PublicKey('5yynpSFAbuykSSTBGwg6E6L3J5zibfVn27e4bUqhecZJ'),
    DEV_WALLET: new PublicKey('h2Gx6Nzd1RRC42Kkm6rHbRR6MrjjgZbqwVDWfdy8B7V'),
    TOKEN_MINT: new PublicKey('GH5HsViK7soco3De9wqJAvUcLbpf4caeMqLk1Lxfqhq'),
    WSOL_MINT: new PublicKey('So11111111111111111111111111111111111111112'), 
    NETWORK: "https://public.ligmanode.com",
    SOL_TARGET: 40,
    MAX_TOKENS_PER_WALLET: 50000000, // 50000000
    EXCHANGE_RATE: 12500000, // Example: 1 SOL = 400,000,000 Tokens  
    TOKEN_DECIMALS: 1000000,

    TOKEN_LABEL: '$DONALD',
    DOMAIN: 'https://donaldmeme.fun',
    // replace icon.svg with desired icon as well!!!

    RAYDIUM_ID: new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'),
    AMM_CONFIG: new PublicKey('D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2'),
    POOL_FEE: new PublicKey('DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'),
  };
  
export default constants;