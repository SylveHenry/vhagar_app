import React, { useState, useEffect } from "react";
import Footer from "./footer";
import navitems from "./components/navlinks";
import ConnectButton from "./components/connect_button";
import svg_logo from "../src/static/logo_with_word.svg";
import {
  Card,
  CardBody,
  Text,
  Grid,
  Box,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Button,
} from "@chakra-ui/react";
import MetricCard from "./components/MetricCard";
import InfoCard from "./components/InfoCard";
import ActionButton from "./components/ActionButton";

export default function AdminPage() {
  const toggleClass = () => {
    setIsNavOpen(!isNavOpen);
    const closeAfterClick = document.querySelector("#nav-icon4");
    closeAfterClick?.classList?.toggle("open");
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);

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
  }, []);

  return (
    <div className="!text-white">
      {/* NAVIGATION */}
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
      {/* body */}
      <Box mt={4}>
        <div className="grid grid-cols-1 smd:grid-cols-2 gap-5 p-3 justify-center mb-6 lg:grid-cols-3">
          <MetricCard title="Total Staked" value="10,000" />
          <MetricCard title="Total Pending Reward" value="500" />
          <MetricCard title="Reward Balance" value="1,200" />
        </div>

        <div className="grid grid-cols-2  gap-5 p-3 justify-center mb-6 lg:grid-cols-4">
          <InfoCard title="Bronze" days="15 days" percentage="5%" />
          <InfoCard title="Silver" days="30 days" percentage="15%" />
          <InfoCard title="Gold" days="60 days" percentage="45%" />
          <InfoCard title="Diamond" days="120 days" percentage="135%" />
        </div>

        <Menu>
          <MenuButton as={Button} colorScheme="teal">
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem>Get APY</MenuItem>
            <MenuItem>Get Stake Info</MenuItem>
            <MenuItem>Get Total Staked</MenuItem>
            <MenuItem>Get Reward Balance</MenuItem>
            <MenuItem>Get Program Pause</MenuItem>
            <MenuItem>Get Staking Pause</MenuItem>
            <MenuItem>Get Manager Address</MenuItem>
          </MenuList>
        </Menu>

        <Box bg="gray.500" p={4} mt={4} borderRadius="lg">
          <Text fontSize="xl" fontWeight="bold">
            Display Area
          </Text>
        </Box>
      </Box>
      <Footer />
    </div>
  );
}
