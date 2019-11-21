import React from "react";
import { compose } from "recompose";
import * as R from "ramda";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { CheckBox as CheckBoxElements } from "react-native-elements";

import { theme } from "src/theme";
import PlainText from "src/components/PlainText";
import { getAnswer, getQuestion, setAnswer } from "src/data/duck";

const CheckBox = ({ checked, title, onPress, color }) => {
  return (
    <CheckBoxElements
      checked={checked}
      title={title}
      onPress={onPress}
      checkedColor={color}
      uncheckedColor={color}
      textStyle={{color}}
    />
  );
};

const Question = ({ question, answer, setAnswer }) => {
  const isAnswered = !R.isNil(answer);

  return (
    <View>
      <PlainText style={{ padding: 10, fontSize: 18 }}>
        {question.title}
      </PlainText>
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
  connect(
    (state, { questionId }) => ({
      question: getQuestion(questionId, state),
      answer: getAnswer(questionId, state)
    }),
    { setAnswer }
  )
)(Question);
