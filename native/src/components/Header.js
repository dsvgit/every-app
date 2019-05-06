import React from "react";
import { Header } from "react-native-elements";
import { Platform, Text, View } from "react-native";
import * as R from "ramda";

import { theme } from "src/theme";

export default ({ title, leftComponent }) => {
  return (
    <Header
      leftComponent={leftComponent}
      centerComponent={{
        text: R.toUpper(title),
        style: {
          color: theme.header,
          marginBottom: Platform.select({
            ios: 0,
            android: 22
          })
        }
      }}
      containerStyle={{
        backgroundColor: theme.primary,
        height: Platform.select({
          ios: 70,
          android: 70 - 24
        })
      }}
    />
  );
};
