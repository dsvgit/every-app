import React from "react";
import { withProps, lifecycle, compose } from "recompose";
import * as R from "ramda";
import { View, TouchableOpacity } from "react-native";

import Question from "./Question";
import PlainText from 'src/components/PlainText';
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
        <PlainText>По выбранной специальности нет вопросов</PlainText>
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
              <PlainText
                style={{
                  color:
                    isAnswered &&
                    (answer === currentQuestion.data.correctId
                      ? theme.success
                      : theme.error)
                }}
              >
                {index + 1}
              </PlainText>
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
          <PlainText>Назад</PlainText>
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
          <PlainText>Далее</PlainText>
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
