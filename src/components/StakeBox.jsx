import React, { useState, useEffect } from "react";
import logo from "../static/logo.png";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useDisclosure } from "@chakra-ui/react";
import OpenPoolModal from "./OpenPoolModal";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";

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

export default function StakeBox({
  tag,
  caption,
  apy,
  lock_period,
  rewards,
  program,
}) {
  const { wallet, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [activeSlot, setActiveSlot] = useState();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [userLockKey, setUserLockKey] = useState();

  useEffect(() => {
    if (!userLockKey) {
      getData();
    }
  }, [anchorWallet]);

  const getData = async () => {
    if (!anchorWallet || !program) return;

    const [userLockInfoKey] = await PublicKey.findProgramAddress(
      [
        Buffer.from("user_lock_info"),
        anchorWallet.publicKey.toBuffer(),
        stakingPoolKey.toBuffer(),
      ],
      program.programId
    );
    setUserLockKey(userLockInfoKey);
    console.log("User Lock Key:", userLockInfoKey.toBase58());
  };

  const openModalWithSlot = async (slot) => {
    setActiveSlot(slot); // Update the slot state first
  };

  useEffect(() => {
    if (activeSlot != null) {
      onOpen();
    }
  }, [activeSlot]);

  return (
    <div className="border-2 max-w-[400px] rounded-lg border-green-800">
      {activeSlot != null && (
        <OpenPoolModal
          isOpen={isOpen}
          tag={tag}
          userLockKey={userLockKey}
          onClose={() => {
            onClose();
            setActiveSlot(null);
          }}
          slot={activeSlot}
          refresh={getData}
          data={() => getFromLocalStorage("user-info")}
          program={program}
        />
      )}

      <h3 className="capitalize text-lg border-b-2 border-green-800 items-center gap-2 flex p-4 py-2">
        <img src={logo} alt="" className="w-10" />
        <p className="text-center">{caption}</p>
      </h3>

      <div className="table-item">
        <p>APY {activeSlot}</p>
        <p>{apy}%</p>
      </div>

      <div className="table-item">
        <p>Lock Period</p>
        <p>{lock_period}</p>
      </div>
      <div className="table-item">
        <p>Reward Percentage</p>
        <p>{rewards}</p>
      </div>
      <div className="flex justify-stretch gap-5 py-5 px-4 gap-y-3 z-20">
        <button
          className="hover:border flex-1 hover:border-white border border-transparent btn font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-[#5FE716] via-[#209B72] to-teal-500"
          disabled={!connected}
          onClick={() => openModalWithSlot(0)}
        >
          Slot 1
        </button>
        <button
          className="flex-1 border border-transparent btn font-semibold text-white rounded-lg bg-gradient-to-r from-[#5FE716] via-[#209B72] to-teal-500 shadow-md hover:border-green-600 hover:bg-none hover:text-green-600 transition-all delay-200 ease-in-out"
          disabled={!connected}
          onClick={() => openModalWithSlot(1)}
        >
          Slot 2
        </button>
      </div>
    </div>
  );
}
