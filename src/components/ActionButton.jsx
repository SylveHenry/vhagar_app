import React from "react";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

function ActionButton({ title }) {
  return (
    <MotionButton
      whileHover={{ scale: 1.1 }}
      bg="teal.500"
      color="white"
      p={4}
      borderRadius="lg"
    >
      {title}
    </MotionButton>
  );
}

export default ActionButton;
