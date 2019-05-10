import * as R from "ramda";
import axios from "axios";

import { REQUEST, SUCCESS, ERROR } from "src/data/constants";
import { host } from "../config";

// constants

const NOT_SELECTED_ID = -1;

// actionTypes

export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_ERROR = "FETCH_DATA_ERROR";
export const SET_CURRENT = "SET_CURRENT";
export const SET_ANSWER = "SET_ANSWER";
export const RESET_QUIZ = "RESET_QUIZ";

// actionCreators

export const fetchData = () => async dispatch => {
  dispatch({ type: FETCH_DATA_REQUEST });

  try {
    const [topics, questions] = R.map(
      response => response.data,
      await Promise.all([
        axios.get(`${host}/topics`),
        axios.get(`${host}/questions`)
      ])
    );

    dispatch({
      type: FETCH_DATA_SUCCESS,
      payload: {
        topics: R.indexBy(x => x.id, topics),
        questions: R.indexBy(x => x.id, questions)
      }
    });
  } catch (error) {
    dispatch({ type: FETCH_DATA_ERROR, error });
  }
};

export const setCurrent = questionId => ({
  type: SET_CURRENT,
  payload: { questionId }
});

export const setAnswer = (questionId, choiceId) => ({
  type: SET_ANSWER,
  payload: { questionId, choiceId }
});

export const resetQuiz = () => ({
  type: RESET_QUIZ
});

// selectors

export const getData = state => state.data;
export const getTopic = R.curry(
  (topicId, state) => getData(state).topics[topicId]
);
export const getTopicQuestions = R.curry((topicId, state) =>
  R.pipe(
    state => getData(state).questions,
    R.values,
    R.filter(question => question.topic.id === topicId)
  )(state)
);
export const getTopicQuestionIds = R.curry((topicId, state) =>
  R.pipe(
    getTopicQuestions(topicId),
    R.map(x => x.id)
  )(state)
);
export const getQuestion = R.curry(
  (questionId, state) => getData(state).questions[questionId]
);
export const getCurrentQuestionId = state => state.quiz.currentQuestionId;
export const getAnswers = state => state.quiz.answers;
export const getAnswer = R.curry(
  (questionId, state) => state.quiz.answers[questionId]
);
export const isTopicEmpty = R.curry((topicId, state) =>
  R.pipe(
    getTopicQuestionIds(topicId),
    R.isEmpty
  )(state)
);
export const isCurrentQuestionSet = state =>
  getCurrentQuestionId(state) !== NOT_SELECTED_ID;

// reducer

const defaultState = {
  data: { topics: null, questions: null },
  error: null,
  status: null,
  quiz: {
    currentQuestionId: NOT_SELECTED_ID,
    answers: {}
  }
};

export default (state = defaultState, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case FETCH_DATA_REQUEST: {
      return R.mergeLeft({ status: REQUEST }, state);
    }
    case FETCH_DATA_SUCCESS: {
      return R.mergeLeft({ data: payload, status: SUCCESS }, state);
    }
    case FETCH_DATA_ERROR: {
      return R.mergeLeft({ error, status: ERROR }, state);
    }
    case SET_CURRENT: {
      const { questionId } = payload;
      return R.set(
        R.lensPath(["quiz", "currentQuestionId"]),
        questionId,
        state
      );
    }
    case SET_ANSWER: {
      const { questionId, choiceId } = payload;
      return R.over(
        R.lensPath(["quiz", "answers"]),
        R.assoc(questionId, choiceId),
        state
      );
    }
    case RESET_QUIZ: {
      return R.set(R.lensProp("quiz"), defaultState.quiz, state);
    }
    default:
      return state;
  }
};
