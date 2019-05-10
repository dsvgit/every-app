import * as R from "ramda";
import axios from "axios";

import { REQUEST, SUCCESS, ERROR } from "src/data/constants";
import { host } from "../config";
import { combineReducers } from "redux";

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

export const getStatus = (statusId, state) =>
  R.path(["statuses", statusId, "status"], state);
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
  statuses: {
    fetchData: { status: null, error: null }
  },
  quiz: {
    currentQuestionId: NOT_SELECTED_ID,
    answers: {}
  }
};

const dataReducer = (state = defaultState.data, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_DATA_SUCCESS: {
      return {
        topics: payload.topics,
        questions: payload.questions
      };
    }
    default:
      return state;
  }
};

const statusesReducer = (state = defaultState.statuses, action) => {
  const { type, error } = action;

  switch (type) {
    case FETCH_DATA_REQUEST: {
      return R.set(
        R.lensProp("fetchData"),
        { status: REQUEST, error: null },
        state
      );
    }
    case FETCH_DATA_SUCCESS: {
      return R.set(
        R.lensProp("fetchData"),
        { status: SUCCESS, error: null },
        state
      );
    }
    case FETCH_DATA_ERROR: {
      return R.set(
        R.lensProp("fetchData"),
        { status: ERROR, error: error },
        state
      );
    }
    default:
      return state;
  }
};

const quizReducer = (state = defaultState.quiz, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT: {
      const { questionId } = payload;
      return R.set(R.lensPath(["currentQuestionId"]), questionId, state);
    }
    case SET_ANSWER: {
      const { questionId, choiceId } = payload;
      return R.over(
        R.lensPath(["answers"]),
        R.assoc(questionId, choiceId),
        state
      );
    }
    case RESET_QUIZ: {
      return defaultState.quiz;
    }
    default:
      return state;
  }
};

export default combineReducers({
  data: dataReducer,
  statuses: statusesReducer,
  quiz: quizReducer
});
