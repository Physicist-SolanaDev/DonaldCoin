export type Presale = {
  "version": "0.1.0",
  "name": "presale",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "swap",
          "accounts": [
            {
              "name": "tokenMint",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyerAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyer",
              "isMut": true,
              "isSigner": true
            },
            {
              "name": "vault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAuth",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "rent",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "systemProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "tokenProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "associatedTokenProgram",
              "isMut": false,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "swap",
          "accounts": [
            {
              "name": "tokenMint",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyerAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyer",
              "isMut": true,
              "isSigner": true
            },
            {
              "name": "vault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAuth",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "rent",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "systemProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "tokenProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "associatedTokenProgram",
              "isMut": false,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "dexInitialize",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address paying to create the pool. Can be anyone"
          ]
        },
        {
          "name": "dev",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must smaller then token_1 mint."
          ]
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint, the key must grater then token_0 mint."
          ]
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "payer token0 account"
          ]
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "creator token1 account"
          ]
        },
        {
          "name": "creatorLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "createPoolFee",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "create pool fee account"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "token0Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "token1Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        },
        {
          "name": "presaleAssociatedTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "presaleAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "timer",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "timerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotReady",
      "msg": "Goal is not fulfilled yet."
    }
  ]
};

export const IDL: Presale = {
  "version": "0.1.0",
  "name": "presale",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "swap",
          "accounts": [
            {
              "name": "tokenMint",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyerAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyer",
              "isMut": true,
              "isSigner": true
            },
            {
              "name": "vault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAuth",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "rent",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "systemProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "tokenProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "associatedTokenProgram",
              "isMut": false,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "swap",
          "accounts": [
            {
              "name": "tokenMint",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyerAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAssociatedTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "buyer",
              "isMut": true,
              "isSigner": true
            },
            {
              "name": "vault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "presaleAuth",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "rent",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "systemProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "tokenProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "associatedTokenProgram",
              "isMut": false,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "dexInitialize",
      "accounts": [
        {
          "name": "cpSwapProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Address paying to create the pool. Can be anyone"
          ]
        },
        {
          "name": "dev",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammConfig",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Which config the pool belongs to."
          ]
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_0 mint, the key must smaller then token_1 mint."
          ]
        },
        {
          "name": "token1Mint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token_1 mint, the key must grater then token_0 mint."
          ]
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorToken0",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "payer token0 account"
          ]
        },
        {
          "name": "creatorToken1",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "creator token1 account"
          ]
        },
        {
          "name": "creatorLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token0Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "createPoolFee",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "create pool fee account"
          ]
        },
        {
          "name": "observationState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create mint account and mint tokens"
          ]
        },
        {
          "name": "token0Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "token1Program",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Spl token program or token program 2022"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Program to create an ATA for receiving position NFT"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "To create a new program account"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Sysvar for program account"
          ]
        },
        {
          "name": "presaleAssociatedTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "presaleAuth",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "timer",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "openTime",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "timerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotReady",
      "msg": "Goal is not fulfilled yet."
    }
  ]
};
