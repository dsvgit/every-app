import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import { theme } from "../theme";

export default ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          color: theme.header,
          marginBottom: Platform.select({
            ios: 0,
            android: 22
          })
        }}
      >
        {"<"} Назад
      </Text>
    </TouchableOpacity>
  );
};
