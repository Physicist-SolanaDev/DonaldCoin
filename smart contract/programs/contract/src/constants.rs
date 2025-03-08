use {
    anchor_lang::prelude::*,
    solana_program::*
};

pub const PROGRAM_ID: Pubkey = pubkey!("5yynpSFAbuykSSTBGwg6E6L3J5zibfVn27e4bUqhecZJ");
pub const RAYDIUM: Pubkey = pubkey!("CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C");
pub const AMM_CONFIG: Pubkey = pubkey!("D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2");
pub const RAYDIUM_FEE: Pubkey = pubkey!("DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8");
pub const WSOL_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
pub const DEV_WALLET: Pubkey = pubkey!("h2Gx6Nzd1RRC42Kkm6rHbRR6MrjjgZbqwVDWfdy8B7V");
pub const TOKENS_PER_SOL: u64 = 12_500_000; //10_000_000
pub const TOKEN_DECIMALS: u64 = 1_000_000;
pub const WSOL_DECIMALS: u64 = 1_000_000_000;
pub const PRESALE_SIZE_TOKEN: u64 = 500_000_000;
pub const LP_SIZE_TOKEN: u64 = 400_000_000;
pub const LP_SIZE_SOL: u64 = LP_SIZE_TOKEN / TOKENS_PER_SOL;