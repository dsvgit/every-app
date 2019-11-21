import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { theme } from "../theme";

export default ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        marginBottom: Platform.select({
          ios: 0,
          android: 22
        })
      }}
    >
      <Icon name="arrow-back" size={22} color={theme.header} />
    </TouchableOpacity>
  );
};
