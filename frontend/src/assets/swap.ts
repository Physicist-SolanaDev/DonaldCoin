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


const handleSwapTransaction = async (e: React.FormEvent<HTMLFormElement>, connection: web3.Connection, anchorWallet: AnchorWallet, isBuying: boolean, tokenAmount: string, solAmount: string) => {
    e.preventDefault();
    
    const provider = new AnchorProvider(connection, anchorWallet, {commitment: "confirmed",});
    const program = new Program<Presale>(IDL, constants.PROGRAM_ID, provider);
    
    const bATA = await getAssociatedTokenAddress(constants.TOKEN_MINT, anchorWallet.publicKey);
    
    const [presaleAuth, bump] = await web3.PublicKey.findProgramAddress(
      [constants.TOKEN_MINT.toBuffer(), constants.PROGRAM_ID.toBuffer()],
      constants.PROGRAM_ID
    );

    const pATA = await getAssociatedTokenAddress(constants.TOKEN_MINT, presaleAuth, true);

    try {
      let instruction;
      const transaction = new web3.Transaction();
      if (isBuying) {
        let buyer_balance = '0'; 

        try {
          const balance = await connection.getTokenAccountBalance(bATA);
          buyer_balance = balance.value.amount;
        } catch (error) {
          console.error('Error fetching token account balance:', error);
        }   
        if ((Number(buyer_balance) + Number(tokenAmount) * constants.TOKEN_DECIMALS) > Number(constants.MAX_TOKENS_PER_WALLET * constants.TOKEN_DECIMALS)) {
          return toast.error(`Limit of ${constants.MAX_TOKENS_PER_WALLET/constants.EXCHANGE_RATE}SOL per buyer.`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            }
          );
        }
        instruction = await program.methods.buyToken(new BN(Number(solAmount) * web3.LAMPORTS_PER_SOL), bump).accounts({
          swap: {
          tokenMint: constants.TOKEN_MINT,
          buyerAssociatedTokenAccount: bATA,
          presaleAssociatedTokenAccount: pATA,
          buyer: anchorWallet.publicKey,
          vault: presaleAuth,
          presaleAuth: presaleAuth,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
          }
        }).instruction();
      } else {
        instruction = await program.methods.sellToken(new BN((Number(tokenAmount)) * constants.TOKEN_DECIMALS), bump).accounts({
          swap: {
          tokenMint: constants.TOKEN_MINT,
          buyerAssociatedTokenAccount: bATA,
          presaleAssociatedTokenAccount: pATA,
          buyer: anchorWallet.publicKey,
          vault: presaleAuth,
          presaleAuth: presaleAuth,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
          }
        }).instruction();
      }

      transaction.add(instruction);

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
  

      console.log(`Transaction signature: ${transactionSignature}`);
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
      console.error(error);
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
        if (error.message.includes("SoldOut")) {
          toast.info('Not enough tokens available.', {
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

  export default handleSwapTransaction;