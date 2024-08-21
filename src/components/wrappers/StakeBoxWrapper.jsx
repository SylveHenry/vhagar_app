import React, { useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { basisPointsToPercentage } from "../../utils/helpers";
import { apy, stake_info as stakeInfo } from "../constants";
import StakeBox from "../StakeBox";

export default function StakeBoxWrapper({ program }) {
  const { wallet, connected } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const getApy = () => {};
  //TODO get apy for bronze gold silver and platnuim here
  return (
    <div className="grid grid-cols-1 gap-5 smd:grid-cols-2  lg:gap-10">
      {stakeInfo.map((i, index) => (
        <StakeBox
          tag={Object.keys(i.tag)[0]}
          caption={Object.keys(i.tag)[0] + " Rewards Pool"}
          apy={basisPointsToPercentage(apy[index].apy)}
          lock_period={i.lockPeriod}
          rewards={i.rewardPercentage}
          key={index}
          program={program}
        />
      ))}
    </div>
  );
}
