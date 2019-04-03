import React from 'react';
import { Link } from 'react-router-dom';
import {
  withProps,
  withReducer,
  withHandlers,
  lifecycle,
  compose
} from 'recompose';
import * as R from 'ramda';

import Exam from './Exam';
import AllQuestions from './AllQuestions';

const Quiz = ({
  data,
  match,
  topic,
  state: { currentQuestionId, answers },
  setAnswer,
  setCurrent
}) => {
  const mode = match.params.mode;

  let content = null;

  switch (mode) {
    case 'exam': {
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
    case 'all': {
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
      content = <div>Неподдерживаемый режим</div>;
    }
  }

  return (
    <div>
      <p>
        <Link to={`/modes/${topic.id}`}>{'<'} Назад</Link>
      </p>
      <h2>{topic.title}</h2>
      {content}
    </div>
  );
};

export default compose(
  withProps(({ data, match }) => {
    const topicId = match.params.topicId;

    return {
      topic: data.topics[topicId]
    };
  }),
  withReducer(
    'state',
    'dispatch',
    (state, action) => {
      const { type, payload } = action;

      switch (type) {
        case 'SET_CURRENT': {
          const { questionId } = payload;
          return R.set(R.lensProp('currentQuestionId'), questionId, state);
        }
        case 'SET_ANSWER': {
          const { questionId, choiceId } = payload;
          return R.over(
            R.lensProp('answers'),
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
        type: 'SET_CURRENT',
        payload: { questionId }
      });
    },
    setAnswer: ({ dispatch }) => (questionId, choiceId) => {
      return dispatch({
        type: 'SET_ANSWER',
        payload: { questionId, choiceId }
      });
    }
  })
)(Quiz);
