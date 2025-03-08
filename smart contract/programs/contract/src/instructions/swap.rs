use {
    anchor_lang::prelude::*,
    anchor_lang::system_program,
    anchor_spl::token,
    anchor_spl::associated_token,
};

use crate::constants;

pub fn buy_token(
    ctx: Context<BuyToken>, 
    sol_amount: u64,
    bump: u8,
) -> Result<()> {
    const CORRECTION: u64 = constants::WSOL_DECIMALS / constants::TOKEN_DECIMALS;
    let token_amount = sol_amount * constants::TOKENS_PER_SOL / CORRECTION;

    if ctx.accounts.swap.presale_associated_token_account.amount < token_amount {
        return err!(Error::SoldOut)
    }

    if constants::LP_SIZE_TOKEN * constants::TOKEN_DECIMALS > (ctx.accounts.swap.presale_associated_token_account.amount - token_amount) {
        return err!(Error::SoldOut)
    }

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.swap.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.swap.buyer.to_account_info(),
                to: ctx.accounts.swap.vault.to_account_info(),
            }
        ),
        sol_amount
    )?;
    msg!("SOL transferred successfully.");

    msg!("Transferring presale tokens from the vault {}...", &ctx.accounts.swap.presale_auth.key());  
    msg!("Mint: {}", &ctx.accounts.swap.token_mint.to_account_info().key());  
    msg!("From Token Address: {}", &ctx.accounts.swap.presale_associated_token_account.key());     
    msg!("To Token Address: {}", &ctx.accounts.swap.buyer_associated_token_account.key());     
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.swap.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.swap.presale_associated_token_account.to_account_info(),
                to: ctx.accounts.swap.buyer_associated_token_account.to_account_info(),
                authority: ctx.accounts.swap.presale_auth.to_account_info(),
            },
            &[&[ctx.accounts.swap.token_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        token_amount
    )?;

    Ok(())
}

#[error_code]
pub enum Error {
    #[msg("Allocation of tokens for sale reached.")]
    SoldOut
}

pub fn sell_token(
    ctx: Context<SellToken>, 
    token_amount: u64,
    bump: u8,
) -> Result<()> {
    const CORRECTION: u64 = constants::WSOL_DECIMALS / constants::TOKEN_DECIMALS;
    let sol_amount = token_amount * CORRECTION / constants::TOKENS_PER_SOL;

    msg!("Transferring presale tokens to the vault {}...", &ctx.accounts.swap.presale_auth.key());  
    msg!("Mint: {}", &ctx.accounts.swap.token_mint.to_account_info().key());  
    msg!("From Token Address: {}", &ctx.accounts.swap.buyer_associated_token_account.key());     
    msg!("To Token Address: {}", &ctx.accounts.swap.presale_associated_token_account.key());     
    token::transfer(
        CpiContext::new(
            ctx.accounts.swap.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.swap.buyer_associated_token_account.to_account_info(),
                to: ctx.accounts.swap.presale_associated_token_account.to_account_info(),
                authority: ctx.accounts.swap.buyer.to_account_info(),
            }
        ),
        token_amount
    )?;

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.swap.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.swap.vault.to_account_info(),
                to: ctx.accounts.swap.buyer.to_account_info(),
            },
            &[&[ctx.accounts.swap.token_mint.key().as_ref(), constants::PROGRAM_ID.as_ref(), &[bump]][..]],
        ),
        sol_amount
    )?;
    msg!("SOL transferred successfully.");

    Ok(())
}


#[derive(Accounts)]
pub struct Swap<'info> { 

#[account(
    mut
)]
pub token_mint: Box<Account<'info, token::Mint>>,

#[account(
    init_if_needed,
    payer = buyer,
    associated_token::mint = token_mint,
    associated_token::authority = buyer,
)]
pub buyer_associated_token_account: Box<Account<'info, token::TokenAccount>>,

#[account(
    mut,
    associated_token::mint = token_mint,
    associated_token::authority = vault,
)]
pub presale_associated_token_account: Box<Account<'info, token::TokenAccount>>,

#[account(mut)]
pub buyer: Signer<'info>,

/// CHECK:
#[account(
    mut,
    seeds = [token_mint.key().as_ref(), constants::PROGRAM_ID.as_ref()],
    bump
)]
pub vault: UncheckedAccount<'info>,
pub presale_auth: SystemAccount<'info>,

pub rent: Sysvar<'info, Rent>,
pub system_program: Program<'info, System>,
pub token_program: Program<'info, token::Token>,
pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}

#[derive(Accounts)]
pub struct BuyToken<'info> {
    pub swap: Swap<'info>,

}

#[derive(Accounts)]
pub struct SellToken<'info> {
    pub swap: Swap<'info>,

}