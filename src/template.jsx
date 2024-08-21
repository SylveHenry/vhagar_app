import React, { useEffect, useState, useMemo, useCallback } from "react";
import Footer from "./footer";
import "@fontsource-variable/inter";
import logo from "../src/static/logo.png";
import svg_logo from "../src/static/logo_with_word.svg";
import bg from "../src/assets/nft/infynft/back.png";
import ConnectButton from "./components/connect_button";
import OpenPoolModal from "./components/OpenPoolModal";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import idl from "./tokens/idl.json";
import StakeBox from "./components/StakeBox";
import StakeBoxWrapper from "./components/wrappers/StakeBoxWrapper";
import navitems from "./components/navlinks";

const InfyNft = () => {
  const { wallet, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  // ! WEB 3 VARIABLES

  const [toggle, setToggle] = useState(false);
  const [program, setProgram] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleClass = () => {
    setIsNavOpen(!isNavOpen);
    const closeAfterClick = document.querySelector("#nav-icon4");
    closeAfterClick?.classList?.toggle("open");
  };
  const [isScrolled, setIsScrolled] = useState(false);

  // wallet and wallet information

  useEffect(() => {
    if (program == null && connected) {
      console.log(AnchorProvider.defaultOptions());

      try {
        const connection = new Connection(web3.clusterApiUrl("devnet"));
        const provider = new AnchorProvider(
          connection,
          anchorWallet,
          AnchorProvider.defaultOptions()
        );

        const programId = new PublicKey(
          "EN2Po9MzhmAz4HYKbQ9Fsvtek2dLqu4D2U6raFZx88Yr"
        );
        const anchorProgram = new Program(idl, programId, provider);
        setProgram(anchorProgram);
      } catch (error) {
        console.log("Error fetching APY:", error);
      }
    }
  }, [wallet, anchorWallet, connected]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [wallet]);

  return (
    <div className="bg-[#050C24] font-interfont flex flex-col justify-between items-center h-[100vh] flex-grow">
      <div className="w-full">
        <div className="relative mx-auto pt-6 flex flex-col items-center justify-center text-[#D2DADF] bg-[url('./src/assets/nft/infynft/gradient.svg')] bg-cover">
          <div className="absolute top-0 z-[1] opacity-10 w-full">
            <img src={bg} alt="backimg" className="mx-auto" />
          </div>
          {/* HEADER */}
          <div
            className={`w-full flex items-center md:block px-5 ${
              isScrolled &&
              "backdrop-blur-sm bg-white/20 fixed top-0 pt-5 z-40 backdrop-filter md:h-20 overscroll-none"
            }`}
          >
            <div className="md:max-w-[1120px] flex items-center justify-between  md:px-0 md:gap-5 mb-8 md:mb-16 container  md:mx-auto">
              <a
                href="https://vhagar.finance/"
                className="z-10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="w-28 " src={svg_logo} alt="logo" />
              </a>
              <div className="gap-5 md:flex hidden z-10">
                {navitems.map((data, index) => {
                  return (
                    <a
                      href={data.link}
                      key={index}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        "hover:text-[#5EE616] text-small font-cartoon hover:border-b-2 uppercase hover:border-[#5EE616] border-b-2   border-transparent"
                      }
                    >
                      {data.text}
                    </a>
                  );
                })}
              </div>
              <div className="gap-2 md:flex items-center hidden">
                <ConnectButton />
              </div>
            </div>
            <div className=" md:hidden -translate-y-4 flex item-center z-30">
              <ConnectButton />
            </div>
            <button
              className="w-12 h-12 z-30 -translate-y-3 relative focus:outline-none md:hidden overscroll-none"
              onClick={() => {
                toggleClass();
                setToggle(!toggle);
              }}
            >
              <div className="block w-5 absolute left-1 top-1/3 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <span
                  className={`
                    block absolute h-0.5 w-7 text-white bg-current transform transition duration-300 ease-in-out
                    ${toggle ? "rotate-45" : "-translate-y-1.5"}`}
                ></span>
                <span
                  className={`
                    block absolute h-0.5 w-7 text-white bg-current transform transition duration-300 ease-in-out
                    ${toggle && "opacity-0"}`}
                ></span>
                <span
                  className={`
                    block absolute h-0.5 w-7 text-white bg-current transform transition duration-300 ease-in-out
                    ${toggle ? "-rotate-45" : "translate-y-1.5"}`}
                ></span>
              </div>
            </button>
            <div
              className={`bg-gradient-to-r from-[#5EE616] to-[#209B72] rounded-xl absolute top-20 right-5 block md:hidden p-0.5 z-20 ${
                toggle ? "visible" : "invisible"
              }`}
            >
              <div className="bg-[#050C24] p-3 rounded-xl text-center">
                {navitems.map((data, index) => (
                  <div key={index} className="p-3">
                    <a
                      href={data.link}
                      className="font-bold text-small font-cartoon text-lg uppercase "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.text}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 xl:px-0 z-10 relative">
            <div className="page-item">
              <h3 className="uppercase text-center text-gradient mb-3 text-3xl font-semibold font-cartoon">
                VHAGAR staking pool
              </h3>
              <p className="text-center text-lg mb-3">
                Vhagar on Solana Staking Pool.
              </p>
           <StakeBoxWrapper program={program} />
            </div>
          </div>
          {/* FOOTER*/}
        </div>
      </div>
      <div className="text-white w-full">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default InfyNft;
