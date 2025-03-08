import { toast, Bounce } from 'react-toastify'
import { Program, BN, AnchorProvider } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
// @ts-ignore
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import constants from './constants.ts';
import { IDL, Presale } from "./idl.ts";
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import signAndSendTransaction from './signAndSendTransaction.ts';


interface PresaleValues {
  vaultBalance: number;
}

const handleLaunchTransaction = async (connection: web3.Connection, anchorWallet: AnchorWallet, presaleValues: PresaleValues) => {

    if ((constants.SOL_TARGET > presaleValues.vaultBalance * 1.009)) {
      return toast.warn('Goal is not fulfilled yet.', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } 

    const provider = new AnchorProvider(
      connection, anchorWallet, AnchorProvider.defaultOptions(),
    );
    const program = new Program<Presale>(IDL, constants.PROGRAM_ID, provider);

    const [timerAccountPubKey] = await web3.PublicKey.findProgramAddress(
      [constants.TOKEN_MINT.toBuffer(), Buffer.from('OpenTime')],
      constants.PROGRAM_ID
    );


    const cATA0 = await getAssociatedTokenAddress(
      constants.WSOL_MINT,
      anchorWallet.publicKey,
    );

    const cATA1 = await getAssociatedTokenAddress(
      constants.TOKEN_MINT,
      anchorWallet.publicKey,
    );

    const [presaleAuth, bump] = await web3.PublicKey.findProgramAddress(
      [
        constants.TOKEN_MINT.toBuffer(),
        constants.PROGRAM_ID.toBuffer(), 
      ],
      constants.PROGRAM_ID, 
    );

    const pATA = await getAssociatedTokenAddress(
      constants.TOKEN_MINT,
      presaleAuth,
      true
    );

    const authority = await web3.PublicKey.findProgramAddress(
      [Buffer.from("vault_and_lp_mint_auth_seed", "utf-8")],
      constants.RAYDIUM_ID, 
    );

    const poolState = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("pool", "utf-8"),
        constants.AMM_CONFIG.toBuffer(),
        constants.WSOL_MINT.toBuffer(),
        constants.TOKEN_MINT.toBuffer(),
      ],
      constants.RAYDIUM_ID, 
    );

    const lpMint = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("pool_lp_mint", "utf-8"),
        poolState[0].toBuffer(),
      ],
      constants.RAYDIUM_ID, 
    );

    const creatorLpToken = await getAssociatedTokenAddress(
      lpMint[0],
      anchorWallet.publicKey,
      true
    );

    const token0Vault = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("pool_vault", "utf-8"),
        poolState[0].toBuffer(),
        constants.WSOL_MINT.toBuffer(),
      ],
      constants.RAYDIUM_ID, 
    );

    const token1Vault = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("pool_vault", "utf-8"),
        poolState[0].toBuffer(),
        constants.TOKEN_MINT.toBuffer(),
      ],
      constants.RAYDIUM_ID, 
    );

    const observationState = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("observation", "utf-8"),
        poolState[0].toBuffer(),
      ],
      constants.RAYDIUM_ID, 
    );


    const open_time = Math.floor(Date.now() / 1000) + 12*60*60;

    try {
      const transaction = new web3.Transaction();

      const initInstruction = await program.methods.init().accounts({
        creator: anchorWallet.publicKey,
        token0Mint: constants.WSOL_MINT,
        token1Mint: constants.TOKEN_MINT,
        creatorToken0: cATA0,
        creatorToken1: cATA1,   
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }).instruction();

      transaction.add(initInstruction);

      const dexInitializeInstruction = await program.methods.dexInitialize(new BN(open_time), bump).accounts({
        cpSwapProgram: constants.RAYDIUM_ID,
        creator: anchorWallet.publicKey,
        dev: constants.DEV_WALLET,
        ammConfig: constants.AMM_CONFIG,
        authority: authority[0],
        poolState: poolState[0],
        token0Mint: constants.WSOL_MINT,
        token1Mint: constants.TOKEN_MINT,
        lpMint: lpMint[0],
        creatorToken0: cATA0,
        creatorToken1: cATA1,
        creatorLpToken: creatorLpToken,
        token0Vault: token0Vault[0],
        token1Vault: token1Vault[0],
        createPoolFee: constants.POOL_FEE,
        observationState: observationState[0],    
        tokenProgram: TOKEN_PROGRAM_ID,
        token0Program: TOKEN_PROGRAM_ID,
        token1Program: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        presaleAssociatedTokenAccount: pATA,
        vault: presaleAuth,
        presaleAuth: presaleAuth,
        timer: timerAccountPubKey,
      }).instruction();

      transaction.add(dexInitializeInstruction);

      let transactionSignature;
      if ('phantom' in window) {
        const anyWindow: any = window;
        const phantom = anyWindow.phantom?.solana;
    
        if (phantom?.isPhantom && phantom?.publicKey?.toBuffer()[0] === anchorWallet.publicKey.toBuffer()[0]) {
          transaction.feePayer = phantom?.publicKey;

          const anyTransaction: any = transaction;
          anyTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

          transactionSignature = await signAndSendTransaction(phantom, transaction);
        } 
        else {
          transactionSignature = await provider.sendAndConfirm(transaction);
        }
      }
      else {
        transactionSignature = await provider.sendAndConfirm(transaction);
      } 
      
      console.log(
        `Transaction signature: ${transactionSignature}`,
      );
      toast.success('Transaction sent.', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
      });

    } catch (error) {
      console.log(error);
      toast.error('Transaction failed.', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      if (error instanceof Error) {
        if (error.message.includes("NotReady")) {
          toast.info('Goal is not fulfilled yet.', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        } 
      }
    }
 };

 export default handleLaunchTransaction;