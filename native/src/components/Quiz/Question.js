import React from "react";
import { withProps, compose } from "recompose";
import * as R from "ramda";
import { View, Text, TouchableOpacity } from "react-native";

import { theme } from "src/theme";

const CheckBox = ({ checked, title, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row" }}>
        <Text>{checked ? " + " : " - "}</Text>
        <Text style={{ color }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Question = ({ question, answer, setAnswer }) => {
  const isAnswered = !R.isNil(answer);

  return (
    <View>
      <Text>{question.title}</Text>
      <View>
        {R.map(choice => {
          const color =
            isAnswered &&
            (answer === choice.id || question.data.correctId === choice.id) &&
            (answer === question.data.correctId ||
            question.data.correctId === choice.id
              ? theme.success
              : theme.error);

          return (
            <View key={`${question.id}_${choice.id}`}>
              <CheckBox
                title={choice.title}
                checked={isAnswered && answer === choice.id}
                onPress={() => !isAnswered && setAnswer(question.id, choice.id)}
                color={color}
              />
            </View>
          );
        }, R.values(question.data.choices))}
      </View>
    </View>
  );
};

export default compose(
  withProps(({ data, id }) => {
    return {
      question: data.questions[id]
    };
  })
)(Question);
