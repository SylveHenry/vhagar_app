import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function InfoCard({ title, days, percentage }) {
  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      bg="gray.700"
      p={4}
      borderRadius="lg"
      textAlign="center"
      color="white"
    >
      <Text fontSize="lg" fontWeight="bold">
        {title}
      </Text>
      <Text>{days}</Text>
      <Text fontSize="2xl" fontWeight="bold">
        {percentage}
      </Text>
    </MotionBox>
  );
}

export default InfoCard;
