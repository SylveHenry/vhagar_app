import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import React, { useRef, useState, useEffect } from "react";

const tokenVault = new PublicKey(
  "DQPsctR9MT5MBgKhPQE8i8faM6CQU7HRtAn8o9fQ7nwG"
);

const tokenMint = new PublicKey("EwVMtR3qMpES8uskX4AFWSxLnRjGRLowaYzn6C4ZN48Y");
const stakingPoolKey = new PublicKey(
  "8zWJYJCowShiE1f8mpAgtuCSnCY2d2Wuyb6VKuMnayC6"
);
const stakeAuthority = new PublicKey(
  "BfwdtsDcLLWiTTL8WprXXDEZsZBNHHKcjiKZ8zhvTXgc"
);
const programId = new PublicKey("DybDiU1cRQMPJQLEE5xbtMZg1cihaW7g9aPvqyDSAwwg");

const stakeVault = new PublicKey(
  "DQPsctR9MT5MBgKhPQE8i8faM6CQU7HRtAn8o9fQ7nwG"
);
const rewardVault = new PublicKey(
  "DQPsctR9MT5MBgKhPQE8i8faM6CQU7HRtAn8o9fQ7nwG"
);
const tokenProgramId = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

async function getBalance(publicKey, mintAddress = null) {
  if (mintAddress) {
    const tokenAccount = getAssociatedTokenAddressSync(
      new PublicKey(mintAddress),
      publicKey,
      true,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      const balance = await connection.getTokenAccountBalance(tokenAccount);
      return balance.value.uiAmount;
    } catch (error) {
      console.error(`Error fetching token balance: ${error.message}`);
      return 0;
    }
  } else {
    const balance = await connection.getBalance(publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
  }
}

function lamportsToTokens(lamports, decimals = 9) {
  return Number(lamports) / Math.pow(10, decimals);
}

function tokensToLamports(tokens, decimals = 9) {
  return Math.floor(tokens * Math.pow(10, decimals));
}

function roundToDecimalPlaces(number, decimalPlaces) {
  return Number(
    Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces
  );
}
function saveToLocalStorage(key, object) {
  try {
    const jsonString = JSON.stringify(object);
    localStorage.setItem(key, jsonString);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Retrieve an object from localStorage
function getFromLocalStorage(key) {
  try {
    const jsonString = localStorage.getItem(key);
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return null;
  }
}

function basisPointsToPercentage(basisPoints) {
  return (parseFloat(basisPoints) / 10000).toFixed(2) + "%";
}

function percentageToBasisPoints(percentage) {
  return Math.round(parseFloat(percentage) * 100);
}

function formatDuration(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
}
function OpenPoolModal({
  userLockKey,
  isOpen,
  onClose,
  program,
  data,
  slot,
  tag,
  refresh,
}) {
  const { wallet } = useWallet();
  const anchorWallet = useAnchorWallet();
  const input = useRef();
  const [userInfo, setUserInfo] = useState(
    data.call() == null ? [] : data.call()
  );
  const [currentSlot, setCurrentSlot] = useState({
    lockedAmount: "-",
    lockedReward: "-",
    unlockTime: "-, -",
    lockedTime: "-, -",
  });

  // Define currentSlot before using it

  const loadSlot = () => {
    let cs =
      userInfo.find((item) => item.tag.toLowerCase() == tag.toLowerCase()) ||
      {};
    if (userInfo != null && slot != null) {
      try {
        console.log(data.call());
      } catch (error) {
        console.log(error);
      }
      for (const item in data.call()) {
        let curr = data.call()[item];

        if (curr.tag.toLowerCase() == tag.toLowerCase() && curr.slot == slot) {
          return setCurrentSlot(curr);
        }
        setCurrentSlot({
          lockedAmount: "-",
          lockedReward: "-",
          unlockTime: "-, -",
          lockedTime: "-, -",
        });
      }
    }
  };
  useEffect(() => {
    console.log(tag, "tag");

    loadSlot();

    return () => {};
  }, [userLockKey, isOpen, onClose, program, data, slot, tag]);

  // !stake function
  const handleStaking = async () => {
    var value = input.current.value;
    input.current.value = null;
    if (value.length < 0.1) return alert("too small");
    try {
      value = parseFloat(value);
    } catch (err) {
      return console.log("invalid value", err, value);
    }
    const lamports = new anchor.BN(parseFloat(value) * 1e9);

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      anchorWallet.publicKey,
      false,
      tokenProgramId
    );
    const lockTagMap = {
      bronze: { bronze: {} },
      silver: { silver: {} },
      gold: { gold: {} },
      diamond: { diamond: {} },
    };
    const lockTagEnum = lockTagMap[tag.toLowerCase()];
    if (!lockTagEnum) {
      throw new Error(
        "Invalid lock tag. Please use Bronze, Silver, Gold, or Diamond."
      );
    }

    const tx = await program.methods
      .stake(lamports, lockTagEnum, parseInt(slot))
      .accounts({
        stakingPool: stakingPoolKey,
        user: anchorWallet.publicKey,
        userTokenAccount: userTokenAccount,
        stakeVault: stakeVault,
        userLockInfo: userLockKey,
        tokenProgram: tokenProgramId,
      })
      .rpc();
    console.log(tx);
  };

  // !refresh info
  const refreshInfo = async () => {
    console.log(currentSlot != null);
    console.log(currentSlot, "is current slot");

    loadSlot();
    const result = await program.methods
      .getUserInfo()
      .accounts({
        stakingPool: stakingPoolKey,
        userLockInfo: userLockKey,
        user: wallet.publicKey,
      })
      .view();
    var data = result.locks
      .map((tagLocks, tagIndex) =>
        tagLocks.map((lock, slotIndex) => ({
          tag: ["Bronze", "Silver", "Gold", "Diamond"][tagIndex],
          slot: slotIndex,
          lockedAmount: lamportsToTokens(lock.lockedAmount),
          lockedReward: lamportsToTokens(lock.lockedReward),
          unlockTime: new Date(lock.unlockTime * 1000).toLocaleString(),
          lockedTime: new Date(lock.lockedTime * 1000).toLocaleString(),
        }))
      )
      .flat()
      .filter((lock) => lock.lockedAmount > 0);
    console.log("results is =", data);
    localStorage.setItem("user-info", JSON.stringify(data));
    setUserInfo(data);
  };

  // !unstake function
  const handleUnstaking = async () => {
    console.log("hmm");
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      anchorWallet.publicKey,
      false,
      tokenProgramId
    );

    const tx = await program.methods
      .unstake(tag, slot)
      .accounts({
        stakingPool: stakingPoolKey,
        user: anchorWallet.publicKey,
        userTokenAccount: userTokenAccount,
        stakeVault: tokenVault,
        rewardVault: tokenVault,
        userLockInfo: userLockKey,
        stakeAuthority: stakeAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();
    console.log(tx, "unstaked info");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent className="bg-primary border-2 border-green-600 !text-white">
        <ModalHeader>
          <h2 className="">Stake VGR</h2>
        </ModalHeader>
        <hr className="border-green-600" />
        <ModalCloseButton />
        <ModalBody>
          <InfoRow
            title={"Locked Amount"}
            value={
              currentSlot["lockedAmount"] != undefined
                ? currentSlot["lockedAmount"].toString()
                : "null"
            }
          />
          <InfoRow
            title={"Locked Reward"}
            value={currentSlot["lockedReward"] || "--"}
          />
          <InfoRow
            title={"Locked Time"}
            value={
              (currentSlot["lockedTime"] &&
                currentSlot["lockedTime"].split(",")[1]) ||
              "--"
            }
          />
          <InfoRow
            title={"Locked Date"}
            value={
              (currentSlot["lockedTime"] &&
                currentSlot["lockedTime"].split(",")[0]) ||
              "--"
            }
          />
          <InfoRow
            title={"Unlock Time"}
            value={
              (currentSlot["unlockTime"] &&
                currentSlot["unlockTime"].split(",")[1]) ||
              "--"
            }
          />
          <InfoRow
            title={"Unlock Date"}
            value={
              (currentSlot["unlockTime"] &&
                currentSlot["unlockTime"].split(",")[0]) ||
              "--"
            }
          />

          <input
            type="number"
            name=""
            ref={input}
            id=""
            className="mb-3 bg-transparent block w-full border border-gray-600 p-1 rounded-md"
          />

          {/* stake and unstake button */}
          <div className="flex justify-between gap-3 mb-5">
            <button
              className="w-full default-gradient btn rounded-md "
              onClick={() => {
                console.log(slot, tag);
                handleStaking();
              }}
            >
              Stake
            </button>
            <button
              className="w-full default-gradient btn rounded-md "
              onClick={refreshInfo}
            >
              Update Info
            </button>
            <button
              className="w-full default-gradient btn rounded-md"
          
              onClick={handleUnstaking}
            >
              Unstake
            </button>
          </div>
        </ModalBody>

        <hr className="border-green-600" />
        {/* <ModalFooter>
          {/* other staking information 
          <div className="flex justify-between w-full">
            <InfoItem amount={0.0} text={"Your Stakings"} />
            <InfoItem amount={0.0} text={"Your Earnings"} />
            <InfoItem amount={0.0} text={"Wallet Balance"} />
          </div>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}

export default OpenPoolModal;

const InfoItem = ({ text, amount }) => {
  return (
    <div className="flex flex-col text-center gap-2">
      <b>{text}</b>
      <p>{amount}</p>
    </div>
  );
};

const InfoRow = ({ title, value }) => {
  return (
    <div className="flex justify-between ">
      <p className="flex-1">{title}:</p>
      <p className="w-[30%]">{value}</p>
    </div>
  );
};
