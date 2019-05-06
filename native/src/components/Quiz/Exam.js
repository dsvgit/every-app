import React from "react";
import { withProps, lifecycle, compose } from "recompose";
import * as R from "ramda";
import { View, Text, TouchableOpacity } from "react-native";

import Question from "./Question";
import { theme } from "src/theme";

const Quiz = ({
  data,
  questions,
  isTopicEmpty,
  isCurrentQuestionSet,
  currentQuestion,
  answers,
  setAnswer,
  setCurrent
}) => {
  if (isTopicEmpty) {
    return (
      <View>
        <Text>По выбранной специальности нет вопросов</Text>
      </View>
    );
  }

  if (!isCurrentQuestionSet) {
    return null;
  }

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        {R.addIndex(R.map)((question, index) => {
          const answer = answers[question.id];
          const isAnswered = !R.isNil(answer);

          return (
            <TouchableOpacity
              key={index}
              style={{
                padding: 8,
                marginRight: 10,
                borderBottomColor: "black",
                borderBottomWidth: question.id === currentQuestion.id ? 1 : 0
              }}
              onPress={() => {
                setCurrent(question.id);
              }}
            >
              <Text
                style={{
                  color:
                    isAnswered &&
                    (answer === currentQuestion.data.correctId
                      ? theme.success
                      : theme.error)
                }}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          );
        }, questions)}
      </View>
      <Question
        data={data}
        answer={answers[currentQuestion.id]}
        setAnswer={setAnswer}
        id={currentQuestion.id}
      />
      {R.head(questions) === currentQuestion || (
        <TouchableOpacity
          onPress={() =>
            setCurrent(
              R.path(
                [[R.indexOf(currentQuestion, questions) - 1], "id"],
                questions
              )
            )
          }
        >
          <Text>Назад</Text>
        </TouchableOpacity>
      )}
      {R.last(questions) === currentQuestion || (
        <TouchableOpacity
          onPress={() =>
            setCurrent(
              R.path(
                [[R.indexOf(currentQuestion, questions) + 1], "id"],
                questions
              )
            )
          }
        >
          <Text>Далее</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default compose(
  withProps(({ data, topic, currentQuestionId }) => {
    const questions = R.filter(
      q => q.topic.id === topic.id,
      R.values(data.questions)
    );

    return {
      questions,
      isTopicEmpty: R.isEmpty(questions),
      isCurrentQuestionSet: currentQuestionId !== -1,
      currentQuestion: data.questions[currentQuestionId]
    };
  }),
  lifecycle({
    componentDidMount() {
      const { isTopicEmpty, setCurrent, questions } = this.props;
      isTopicEmpty || setCurrent(R.head(questions).id);
    }
  })
)(Quiz);
