import React from "react";
import { withProps, compose } from "recompose";
import * as R from "ramda";
import { View, Text, TouchableOpacity } from "react-native";

const CheckBox = ({ checked, title, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row'}}>
        <Text>{checked ? ' + ' : ' - '}</Text>
        <Text style={{ color }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Question = ({ question: q, answer, setAnswer }) => {
  const isAnswered = !R.isNil(answer);

  return (
    <View>
      <Text>{q.title}</Text>
      <View>
        {R.map(
          choice => (
            <View key={choice.id}>
              <CheckBox
                title={choice.title}
                checked={isAnswered && answer === choice.id}
                onPress={() => !isAnswered && setAnswer(q.id, choice.id)}
                color={isAnswered &&
                (answer === choice.id || q.data.correctId === choice.id) &&
                (answer === q.data.correctId || q.data.correctId === choice.id
                  ? 'green'
                  : 'red')}
              />
            </View>
          ),
          R.values(q.data.choices)
        )}
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
