import React from "react";
import { withProps, withReducer, withHandlers, compose } from "recompose";
import * as R from "ramda";
import { View, Text } from "react-native";

import Exam from "./Exam";
import AllQuestions from "./AllQuestions";
import Header from "src/components/Header";
import { connect } from "react-redux";
import { getData } from "src/data/duck";
import ArrowBackIcon from "../ArrowBackIcon";

const Quiz = ({
  data,
  match,
  topic,
  state: { currentQuestionId, answers },
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
          data={data}
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
        <AllQuestions
          data={data}
          topic={topic}
          answers={answers}
          setAnswer={setAnswer}
        />
      );
      break;
    }
    default: {
      content = (
        <View>
          <Text>Неподдерживаемый режим</Text>
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

export default compose(
  connect(state => ({
    data: getData(state)
  })),
  withProps(({ data, match }) => {
    const topicId = match.params.topicId;

    return {
      topic: data.topics[topicId]
    };
  }),
  withReducer(
    "state",
    "dispatch",
    (state, action) => {
      const { type, payload } = action;

      switch (type) {
        case "SET_CURRENT": {
          const { questionId } = payload;
          return R.set(R.lensProp("currentQuestionId"), questionId, state);
        }
        case "SET_ANSWER": {
          const { questionId, choiceId } = payload;
          return R.over(
            R.lensProp("answers"),
            R.assoc(questionId, choiceId),
            state
          );
        }
        default:
          return state;
      }
    },
    {
      currentQuestionId: -1,
      answers: {}
    }
  ),
  withHandlers({
    setCurrent: ({ dispatch }) => questionId => {
      return dispatch({
        type: "SET_CURRENT",
        payload: { questionId }
      });
    },
    setAnswer: ({ dispatch }) => (questionId, choiceId) => {
      return dispatch({
        type: "SET_ANSWER",
        payload: { questionId, choiceId }
      });
    }
  })
)(Quiz);
