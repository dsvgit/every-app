import React from "react";
import { View } from "react-native";
import * as R from "ramda";
import { connect } from "react-redux";

import Exam from "./Exam";
import AllQuestions from "./AllQuestions";
import Header from "src/components/Header";
import {
  setCurrent,
  setAnswer,
  getTopic,
  getCurrentQuestionId,
  getAnswers
} from "src/data/duck";
import ArrowBackIcon from "../ArrowBackIcon";
import PlainText from "src/components/PlainText";

const Quiz = ({
  match,
  topic,
  currentQuestionId,
  answers,
  setAnswer,
  setCurrent,
  history
}) => {
  const mode = match.params.mode;

  let content = null;

  switch (mode) {
    case "exam": {
      content = (
        <Exam
          topic={topic}
          answers={answers}
          currentQuestionId={currentQuestionId}
          setAnswer={setAnswer}
          setCurrent={setCurrent}
        />
      );
      break;
    }
    case "all": {
      content = (
        <AllQuestions topic={topic} answers={answers} setAnswer={setAnswer} />
      );
      break;
    }
    default: {
      content = (
        <View>
          <PlainText>Неподдерживаемый режим</PlainText>
        </View>
      );
    }
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

export default R.compose(
  connect(
    state => ({
      topic: getTopic(match.params.topicId, state),
      currentQuestionId: getCurrentQuestionId(state),
      answers: getAnswers(state)
    }),
    {
      setCurrent,
      setAnswer
    }
  )
)(Quiz);
