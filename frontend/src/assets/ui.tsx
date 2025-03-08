import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { ToastContainer, Bounce, toast } from 'react-toastify'
import * as web3 from '@solana/web3.js';
// @ts-ignore
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import constants from './constants.ts';
import handleSwapTransaction from './swap.ts';
import handleLaunchTransaction from './launch.ts';

function Ui() {
  const [solAmount, setSolAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isBuying, setIsBuying] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const [presaleValues, setPresaleValues] = useState({ opentime: 0, vaultBalance: 0 });

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const getValues = async () => {
    try {
      const connection = new web3.Connection(constants.NETWORK, "confirmed");
  
      const [timerAccountPubKey] = await web3.PublicKey.findProgramAddress(
        [
          constants.TOKEN_MINT.toBuffer(), 
          Buffer.from('OpenTime')
        ],
        constants.PROGRAM_ID
      );

      const [presaleAuth] = await web3.PublicKey.findProgramAddress(
        [
          constants.TOKEN_MINT.toBuffer(),
          constants.PROGRAM_ID.toBuffer(), 
        ],
        constants.PROGRAM_ID, 
      );
  
      const accountInfo = await connection.getAccountInfo(timerAccountPubKey);
      if (!accountInfo) {
        const vaultBalance = await connection.getBalance(presaleAuth);
        setPresaleValues({opentime: 0, vaultBalance: vaultBalance / 1e9});
      }
      else {
        setIsBlurred(true);
        const count = accountInfo.data.readBigUInt64LE(8);
        const vaultBalance = await connection.getBalance(presaleAuth);
        setPresaleValues({opentime: Number(count), vaultBalance: vaultBalance / 1e9}); 
      }
    } catch (error) {
      console.error("Error fetching data from blockchain.", error);
      return null;
    }
  };

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSolAmount(value);
    setTokenAmount((Number(value) * constants.EXCHANGE_RATE).toFixed(0));
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenAmount(value);
    setSolAmount((Number(value) / constants.EXCHANGE_RATE).toFixed(0));
  };

  useEffect(() => {
    getValues();
    const interval = setInterval(getValues, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const formElements = document.querySelectorAll('input[readonly], input');

    formElements.forEach((element) => {
      const inputElement = element as HTMLElement;

      inputElement.style.backgroundColor = '#f2f2f2'; 
      inputElement.style.border = '1px solid #ccc'; 
      inputElement.style.cursor = 'text';
      inputElement.style.color = 'initial'; 
      inputElement.style.opacity = '1'; 
      inputElement.style.padding = '5px'; 
    });
  }, []); 

  return (
    <div className="app-container">
      {isBlurred &&(
        <div className="countdown-overlay">
          <p>Been launched, live on Raydium at <b>{(new Date(presaleValues.opentime * 1000).toUTCString())}</b></p>
        </div>
      )}
      <div className={`app-container ${isBlurred ? 'blurred' : ''}`}>
        <div className="card">
          <form onSubmit={(e) => {
                if (!anchorWallet) {
                      return toast.warn('Connect your wallet first.', {
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
                  handleSwapTransaction(e, connection, anchorWallet, isBuying, tokenAmount, solAmount)}
                }>
            <div className="input-group">
              <label>$SOL</label>
              <input
                type="number"
                value={solAmount}
                onChange={handleSolChange}
                required
                min="0"
                step="0.01"
                placeholder="$SOL"
                className="input-box"
               />
            </div>

           <div className="toggle-container">
             <span className="swap-icon" onClick={() => setIsBuying(!isBuying)}>{isBuying ? '⇊' : '⇈'}</span>
           </div>

           <div className="input-group">
            <label>{constants.TOKEN_LABEL}</label>
            <input
              value={tokenAmount}
              onChange={handleTokenChange}
              readOnly
              placeholder={constants.TOKEN_LABEL}
              className="input-box"
            />
           </div>

           <button type="submit" disabled={isBlurred}>{isBuying ? 'Buy' : 'Sell'}</button>
          </form>
        </div>

        {!isBlurred &&(
        <div className="progress-bar-outer">
          <div className="progress-bar-text">
            {Math.round(presaleValues.vaultBalance * 100) / 100}/{constants.SOL_TARGET} SOL
          </div>
          <div className="progress-bar-inner" style={{
            width: `calc(${presaleValues.vaultBalance * (100 / constants.SOL_TARGET)}% - 4px)`}}>
          </div>
        </div>
        )}

        <div className="card">
            <p style={{textAlign: 'justify'}}>
              After reaching goal above, it takes only one person to use button below 
              to initialize Raydium trading pair. It could be anyone.
              Then {constants.TOKEN_LABEL} will be live for trading.
              No other actions are required from the rest of the holders.
            </p>
            <button onClick={() => {
                if (!anchorWallet) {
                      return toast.warn('Connect your wallet first.', {
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
                handleLaunchTransaction(connection, anchorWallet, presaleValues)} 
              }
              disabled={isBlurred}>Launch
            </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default Ui;
