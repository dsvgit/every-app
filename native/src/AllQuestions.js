import React from 'react';
import { withProps, compose } from 'recompose';
import * as R from 'ramda';
import { View, Text } from "react-native";

import Question from './Question';

const Quiz = ({
  data,
  questionIds,
  isTopicEmpty,
  answers,
  setAnswer
}) => {
  if (isTopicEmpty) {
    return <View><Text>По выбранной специальности нет вопросов</Text></View>;
  }

  return (
    <View>
      {R.map(
        id => (
          <Question
            data={data}
            answer={answers[id]}
            setAnswer={setAnswer}
            key={id}
            id={id}
          />
        ),
        questionIds
      )}
    </View>
  );
};

export default compose(
  withProps(({ data, topic }) => {
    const questionIds = R.map(
      x => x.id,
      R.filter(q => q.topic.id === topic.id, R.values(data.questions))
    );

    return {
      questionIds,
      isTopicEmpty: R.isEmpty(questionIds)
    };
  })
)(Quiz);
