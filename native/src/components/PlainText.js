import React from "react";
import { Text, StyleSheet } from "react-native";

import { theme } from "src/theme";

const PlainText = props => {
  return (
    <Text
      {...props}
      style={{
        ...props.style,
        color: props.style && props.style.color ? props.style.color : theme.text
      }}
    />
  );
};

export default PlainText;
