import * as R from "ramda";
import axios from "axios";

import { REQUEST, SUCCESS, ERROR } from "src/data/constants";
import { host } from "../config";

export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_ERROR = "FETCH_DATA_ERROR";

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

export const getData = state => state.data;

const defaultState = {
  data: { topics: null, questions: null },
  error: null,
  status: null
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
  }

  return state;
};
