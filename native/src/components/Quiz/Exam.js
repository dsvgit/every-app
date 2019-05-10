import React from "react";
import { lifecycle, compose } from "recompose";
import * as R from "ramda";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import Question from "./Question";
import PlainText from "src/components/PlainText";
import { theme } from "src/theme";
import {
  getAnswers,
  getCurrentQuestionId,
  getQuestion,
  getTopic,
  getTopicQuestionIds,
  isCurrentQuestionSet,
  isTopicEmpty,
  setCurrent,
  resetQuiz
} from "src/data/duck";
import Header from "src/components/Header";
import ArrowBackIcon from "src/components/ArrowBackIcon";

const Exam = ({
  topic,
  questionIds,
  isTopicEmpty,
  isCurrentQuestionSet,
  currentQuestion,
  currentQuestionId,
  answers,
  setCurrent,
  history
}) => {
  let content = null;

  if (isTopicEmpty) {
    content = (
      <View>
        <PlainText>По выбранной специальности нет вопросов</PlainText>
      </View>
    );
  } else if (!isCurrentQuestionSet) {
    content = null;
  } else {
    content = (
      <View>
        <View style={{ flexDirection: "row" }}>
          {R.addIndex(R.map)((questionId, index) => {
            const answer = answers[questionId];
            const isAnswered = !R.isNil(answer);

            return (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 8,
                  marginRight: 10,
                  borderBottomColor: "black",
                  borderBottomWidth: questionId === currentQuestion.id ? 1 : 0
                }}
                onPress={() => {
                  setCurrent(questionId);
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
          }, questionIds)}
        </View>
        <Question questionId={currentQuestionId} />
        {R.head(questionIds) === currentQuestionId || (
          <TouchableOpacity
            onPress={() =>
              setCurrent(
                questionIds[R.indexOf(currentQuestionId, questionIds) - 1]
              )
            }
          >
            <PlainText>Назад</PlainText>
          </TouchableOpacity>
        )}
        {R.last(questionIds) === currentQuestionId || (
          <TouchableOpacity
            onPress={() =>
              setCurrent(
                questionIds[R.indexOf(currentQuestionId, questionIds) - 1]
              )
            }
          >
            <PlainText>Далее</PlainText>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View>
      <Header
        title={topic.title}
        leftComponent={<ArrowBackIcon onPress={() => history.goBack()} />}
      />
      {content}
    </View>
  );
};

export default compose(
  connect(
    (state, { match }) => ({
      topic: getTopic(match.params.topicId, state),
      isTopicEmpty: isTopicEmpty(match.params.topicId, state),
      answers: getAnswers(state),
      questionIds: getTopicQuestionIds(match.params.topicId, state),
      currentQuestionId: getCurrentQuestionId(state),
      currentQuestion: getQuestion(getCurrentQuestionId(state), state),
      isCurrentQuestionSet: isCurrentQuestionSet(state)
    }),
    {
      setCurrent,
      resetQuiz
    }
  ),
  lifecycle({
    componentDidMount() {
      const { isTopicEmpty, setCurrent, questionIds } = this.props;
      isTopicEmpty || setCurrent(R.head(questionIds));
    },
    componentWillUnmount() {
      const { resetQuiz } = this.props;
      resetQuiz();
    }
  })
)(Exam);
