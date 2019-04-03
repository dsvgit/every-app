import React from 'react';
import { withProps, lifecycle, compose } from 'recompose';
import classNames from 'classnames';
import * as R from 'ramda';

import Question from './Question';

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
    return <div>По выбранной специальности нет вопросов</div>;
  }

  if (!isCurrentQuestionSet) {
    return null;
  }

  return (
    <div>
      <nav>
        {R.addIndex(R.map)((question, index) => {
          const answer = answers[question.id];
          const isAnswered = !R.isNil(answer);

          return (
            <a
              className={classNames(
                isAnswered &&
                  (answer === currentQuestion.data.correctId
                    ? 'success'
                    : 'error'),
                { current: question.id === currentQuestion.id }
              )}
              style={{ marginRight: 10 }}
              href="#"
              onClick={e => {
                e.preventDefault();
                setCurrent(question.id);
              }}
            >
              {index + 1}
            </a>
          );
        }, questions)}
      </nav>
      <Question
        data={data}
        answer={answers[currentQuestion.id]}
        setAnswer={setAnswer}
        id={currentQuestion.id}
      />
      {R.head(questions) === currentQuestion || (
        <button
          onClick={() =>
            setCurrent(
              R.path(
                [[R.indexOf(currentQuestion, questions) - 1], 'id'],
                questions
              )
            )
          }
        >
          Назад
        </button>
      )}
      {R.last(questions) === currentQuestion || (
        <button
          onClick={() =>
            setCurrent(
              R.path(
                [[R.indexOf(currentQuestion, questions) + 1], 'id'],
                questions
              )
            )
          }
        >
          Далее
        </button>
      )}
    </div>
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
