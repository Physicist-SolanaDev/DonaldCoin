use {
    anchor_lang::prelude::*,
    anchor_lang::system_program,
    anchor_spl::token::{self, Burn, Token},
    anchor_spl::associated_token::AssociatedToken,
    anchor_spl::token_interface::{Mint, TokenAccount},
};
use raydium_cp_swap::{
    utils::U128,
    cpi,
    states::{OBSERVATION_SEED, POOL_LP_MINT_SEED, POOL_SEED, POOL_VAULT_SEED},
};

use crate::constants;

pub fn dex_initialize(
    ctx: Context<DEXInitialize>,
    init_amount_0: u64,
    init_amount_1: u64,
    open_time: u64,
    bump: u8,
) -> Result<()> {
    if constants::LP_SIZE_TOKEN * 101 / 100 * constants::TOKEN_DECIMALS < ctx.accounts.presale_associated_token_account.amount{
        return err!(Error::NotReady)
    }
    // transfer sol to creator account
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.creator_token_0.to_account_info(),
            },
            &[&[ctx.accounts.token_1_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        init_amount_0
    )?;

    msg!("Compensating signer for launch fees...");
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.creator.to_account_info(),
            },
            &[&[ctx.accounts.token_1_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        2 * constants::WSOL_DECIMALS / 10
    )?;

    msg!("Allocating remaining SOL for initial marketing expenses on DEXscreener...");
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.dev.to_account_info(),
            },
            &[&[ctx.accounts.token_1_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        ctx.accounts.vault.to_account_info().lamports()
    )?;

    // Sync the native token to reflect the new SOL balance as wSOL
    let cpi_accounts = token::SyncNative {
        account: ctx.accounts.creator_token_0.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::sync_native(cpi_ctx)?;

    //send tokens from vault to creator
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.presale_associated_token_account.to_account_info(),
                to: ctx.accounts.creator_token_1.to_account_info(),
                authority: ctx.accounts.presale_auth.to_account_info(),
            },
            &[&[ctx.accounts.token_1_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        init_amount_1
    )?;

    let cpi_accounts = cpi::accounts::Initialize {
        creator: ctx.accounts.creator.to_account_info(),
        amm_config: ctx.accounts.amm_config.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        pool_state: ctx.accounts.pool_state.to_account_info(),
        token_0_mint: ctx.accounts.token_0_mint.to_account_info(),
        token_1_mint: ctx.accounts.token_1_mint.to_account_info(),
        lp_mint: ctx.accounts.lp_mint.to_account_info(),
        creator_token_0: ctx.accounts.creator_token_0.to_account_info(),
        creator_token_1: ctx.accounts.creator_token_1.to_account_info(),
        creator_lp_token: ctx.accounts.creator_lp_token.to_account_info(),
        token_0_vault: ctx.accounts.token_0_vault.to_account_info(),
        token_1_vault: ctx.accounts.token_1_vault.to_account_info(),
        create_pool_fee: ctx.accounts.create_pool_fee.to_account_info(),
        observation_state: ctx.accounts.observation_state.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        token_0_program: ctx.accounts.token_0_program.to_account_info(),
        token_1_program: ctx.accounts.token_1_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let cpi_context = CpiContext::new(ctx.accounts.cp_swap_program.to_account_info(), cpi_accounts);
    cpi::initialize(cpi_context, init_amount_0, init_amount_1, open_time);

    let liquidity = U128::from(init_amount_0)
        .checked_mul(init_amount_1.into())
        .unwrap()
        .integer_sqrt()
        .as_u64();
    
    let cpi_accounts_burn = Burn {
        mint: ctx.accounts.lp_mint.to_account_info(),
        from: ctx.accounts.creator_lp_token.to_account_info(),
        authority: ctx.accounts.creator.to_account_info(),
    };
    let cpi_context_burn = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_burn);

    token::burn(cpi_context_burn, liquidity-100)?;

    let timer = &mut ctx.accounts.timer;
    timer.count = open_time;

    Ok(())
}

#[error_code]
pub enum Error {
    #[msg("Goal is not fulfilled yet.")]
    NotReady
}

#[account]
pub struct TimerAccount {
pub count: u64,
}

#[derive(Accounts)]
pub struct DEXInitialize<'info> {
    /// CHECK:
    #[account(address = constants::RAYDIUM)]
    pub cp_swap_program: UncheckedAccount<'info>,
    /// Address paying to create the pool. Can be anyone
    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK:
    #[account(
        mut,
        address = constants::DEV_WALLET
    )]
    pub dev: UncheckedAccount<'info>,

    /// Which config the pool belongs to.
    /// CHECK:
    #[account(address = constants::AMM_CONFIG)]
    pub amm_config: UncheckedAccount<'info>,

    /// CHECK: pool vault and lp mint authority
    #[account(
        seeds = [
            raydium_cp_swap::AUTH_SEED.as_bytes(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub authority: UncheckedAccount<'info>,

    /// CHECK: Initialize an account to store the pool state, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_SEED.as_bytes(),
            amm_config.key().as_ref(),
            token_0_mint.key().as_ref(),
            token_1_mint.key().as_ref(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub pool_state: UncheckedAccount<'info>,

    /// Token_0 mint, the key must smaller then token_1 mint.
    #[account(
        address = constants::WSOL_MINT,
        constraint = token_0_mint.key() < token_1_mint.key(),
        mint::token_program = token_0_program,
    )]
    pub token_0_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Token_1 mint, the key must grater then token_0 mint.
    #[account(
        mint::token_program = token_1_program,
    )]
    pub token_1_mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: pool lp mint, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_LP_MINT_SEED.as_bytes(),
            pool_state.key().as_ref(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub lp_mint: UncheckedAccount<'info>,

    /// payer token0 account
    #[account(
        mut,
        token::mint = token_0_mint,
        token::authority = creator,
    )]
    pub creator_token_0: Box<InterfaceAccount<'info, TokenAccount>>,

    /// creator token1 account
    #[account(
        mut,
        token::mint = token_1_mint,
        token::authority = creator,
    )]
    pub creator_token_1: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: creator lp ATA token account, init by cp-swap
    #[account(mut)]
    pub creator_lp_token: UncheckedAccount<'info>,

    /// CHECK: Token_0 vault for the pool, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_VAULT_SEED.as_bytes(),
            pool_state.key().as_ref(),
            token_0_mint.key().as_ref()
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub token_0_vault: UncheckedAccount<'info>,

    /// CHECK: Token_1 vault for the pool, init by cp-swap
    #[account(
        mut,
        seeds = [
            POOL_VAULT_SEED.as_bytes(),
            pool_state.key().as_ref(),
            token_1_mint.key().as_ref()
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub token_1_vault: UncheckedAccount<'info>,

    /// create pool fee account
    #[account(
        mut,
        address= constants::RAYDIUM_FEE,
    )]
    pub create_pool_fee: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: an account to store oracle observations, init by cp-swap
    #[account(
        mut,
        seeds = [
            OBSERVATION_SEED.as_bytes(),
            pool_state.key().as_ref(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub observation_state: UncheckedAccount<'info>,

    /// Program to create mint account and mint tokens
    pub token_program: Program<'info, Token>,
    /// Spl token program or token program 2022
    pub token_0_program: Program<'info, Token>,
    /// Spl token program or token program 2022
    pub token_1_program: Program<'info, Token>,
    /// Program to create an ATA for receiving position NFT
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// To create a new program account
    pub system_program: Program<'info, System>,
    /// Sysvar for program account
    pub rent: Sysvar<'info, Rent>,

    #[account(
        mut,
        associated_token::mint = token_1_mint,
        associated_token::authority = vault,
    )]
    pub presale_associated_token_account: Box<Account<'info, token::TokenAccount>>,
    
    /// CHECK:
    #[account(
        mut,
        seeds = [token_1_mint.key().as_ref(), constants::PROGRAM_ID.as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,
    pub presale_auth: SystemAccount<'info>,

    #[account(
        init, 
        payer=creator, 
        seeds = [
            token_1_mint.key().as_ref(),
            "OpenTime".as_bytes(),
        ],
        bump,
        space = 8 + 8
    )]
    pub timer: Account<'info, TimerAccount>,
}