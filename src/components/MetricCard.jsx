import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function MetricCard({ title, value }) {
  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      bg="blue.500"
      p={4}
      borderRadius="lg"
      textAlign="center"
      color="white"
    >
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      <Text fontSize="3xl" fontWeight="bold">
        {value}
      </Text>
    </MotionBox>
  );
}

export default MetricCard;
