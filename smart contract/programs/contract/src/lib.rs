use {
    anchor_lang::prelude::*,
    anchor_spl::token,
    anchor_spl::associated_token,
    instructions::*,
    anchor_spl::token::{Token},
    anchor_spl::associated_token::AssociatedToken,
    anchor_spl::token_interface::{Mint, TokenAccount},
};

mod constants;
mod instructions;


declare_id!(constants::PROGRAM_ID);


#[program]
pub mod presale {
    use super::*;

    pub fn init(
        ctx: Context<Init>, 
    ) -> Result<()> { Ok(()) }

    // 1. Buy tokens
    pub fn buy_token(
        ctx: Context<BuyToken>, 
        sol_amount: u64,
        bump: u8,
    ) -> Result<()> {
        return swap::buy_token(ctx, sol_amount, bump)
    }

    // 2. Sell tokens
    pub fn sell_token(
        ctx: Context<SellToken>, 
        token_amount: u64,
        bump: u8,
    ) -> Result<()> {
        return swap::sell_token(ctx, token_amount, bump)
    }

    // 3. Launch on Raydium DEX
    pub fn dex_initialize(
        ctx: Context<DEXInitialize>,
        //init_amount_0: u64,
        //init_amount_1: u64,
        open_time: u64,
        bump: u8,
    ) -> Result<()> {
        return launch::dex_initialize(
            ctx, 
            constants::LP_SIZE_SOL * constants::WSOL_DECIMALS, 
            constants::LP_SIZE_TOKEN * constants::TOKEN_DECIMALS, 
            open_time, 
            bump)
    }

}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        address = constants::WSOL_MINT,
        constraint = token_0_mint.key() < token_1_mint.key(),
        mint::token_program = token_program,
    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mint::token_program = token_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = token_0_mint,
        associated_token::authority = creator,
    )]
    pub creator_token_0: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = token_1_mint,
        associated_token::authority = creator,
    )]
    pub creator_token_1: Box<InterfaceAccount<'info, TokenAccount>>,

}