import React from "react";
import { withProps, compose } from "recompose";
import * as R from "ramda";
import { View, TouchableOpacity } from "react-native";

import { theme } from "src/theme";
import PlainText from "src/components/PlainText";

const CheckBox = ({ checked, title, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row" }}>
        <PlainText>{checked ? " + " : " - "}</PlainText>
        <PlainText style={{ color }}>{title}</PlainText>
      </View>
    </TouchableOpacity>
  );
};

const Question = ({ question, answer, setAnswer }) => {
  const isAnswered = !R.isNil(answer);

  return (
    <View>
      <PlainText>{question.title}</PlainText>
      <View>
        {R.map(choice => {
          const color = isAnswered
            ? (answer === choice.id || question.data.correctId === choice.id) &&
              (answer === question.data.correctId ||
              question.data.correctId === choice.id
                ? theme.success
                : theme.error)
            : undefined;

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
