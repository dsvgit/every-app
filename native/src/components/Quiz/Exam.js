import React from "react";
import { lifecycle, compose } from "recompose";
import * as R from "ramda";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Badge, Button } from "react-native-elements";

import Question from "./Question";
import PlainText from "src/components/PlainText";
import { theme } from "src/theme";
import {
  getAnswers,
  getCurrentQuestionId,
  getQuestion,
  getTopic,
  getTopicQuestionIds,
  getTopicQuestions,
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
  questions,
  isTopicEmpty,
  isCurrentQuestionSet,
  currentQuestion,
  currentQuestionId,
  nextQuestionId,
  prevQuestionId,
  hasNextButton,
  hasPrevButton,
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
          {R.addIndex(R.map)((question, index) => {
            const questionId = question.id;
            const answer = answers[questionId];
            const isAnswered = !R.isNil(answer);

            return (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 8,
                  marginRight: 10
                }}
                onPress={() => {
                  setCurrent(questionId);
                }}
              >
                <Badge
                  badgeStyle={{
                    backgroundColor: isAnswered
                      ? answer === question.data.correctId
                        ? theme.success
                        : theme.error
                      : theme.primary,
                    borderWidth: questionId === currentQuestion.id ? 0 : 2
                  }}
                  value={index + 1}
                />
              </TouchableOpacity>
            );
          }, questions)}
        </View>
        <View style={{marginBottom: 5}}>
          <Question questionId={currentQuestionId} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {hasPrevButton ? (
            <Button
              buttonStyle={{width: 150, margin: 20}}
              onPress={() => setCurrent(prevQuestionId)}
              iconLeft
              title="Назад"
            />
          ) : (
            <View />
          )}
          {hasNextButton ? (
            <Button
              buttonStyle={{width: 150, margin: 20}}
              onPress={() => setCurrent(nextQuestionId)}
              iconRight
              title="Далее"
            />
          ) : (
            <View />
          )}
        </View>
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
    (state, { match }) => {
      const questionIds = getTopicQuestionIds(match.params.topicId, state);
      const questions = getTopicQuestions(match.params.topicId, state);
      const currentQuestionId = getCurrentQuestionId(state);
      const nextQuestionId =
        questionIds[R.indexOf(currentQuestionId, questionIds) + 1];
      const prevQuestionId =
        questionIds[R.indexOf(currentQuestionId, questionIds) - 1];

      return {
        topic: getTopic(match.params.topicId, state),
        isTopicEmpty: isTopicEmpty(match.params.topicId, state),
        answers: getAnswers(state),
        questionIds,
        questions,
        currentQuestionId,
        currentQuestion: getQuestion(getCurrentQuestionId(state), state),
        isCurrentQuestionSet: isCurrentQuestionSet(state),
        nextQuestionId,
        prevQuestionId,
        hasNextButton: !R.isNil(nextQuestionId),
        hasPrevButton: !R.isNil(prevQuestionId)
      };
    },
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
