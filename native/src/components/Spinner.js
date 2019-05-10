import React from "react";
import { ActivityIndicator as ActivityIndicatorRN } from "react-native";

import { theme } from "src/theme";

const Spinner = props => (
  <ActivityIndicatorRN color={theme.primary} {...props} />
);

export default Spinner;
