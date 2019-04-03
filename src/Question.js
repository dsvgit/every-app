import React from 'react';
import { withProps, compose } from 'recompose';
import * as R from 'ramda';

import data from './data';

const Question = ({ question: q, answer, setAnswer }) => {
  const isAnswered = !R.isNil(answer);

  return (
    <section>
      <h3>{q.title}</h3>
      <div>
        {R.map(
          choice => (
            <div>
              <label
                className={
                  isAnswered &&
                  (answer === choice.id || q.data.correctId === choice.id) &&
                  (answer === q.data.correctId || q.data.correctId === choice.id
                    ? 'success'
                    : 'error')
                }
              >
                <input
                  type="radio"
                  checked={isAnswered && answer === choice.id}
                  onChange={() => !isAnswered && setAnswer(q.id, choice.id)}
                />
                {choice.title}
              </label>
            </div>
          ),
          R.values(q.data.choices)
        )}
      </div>
    </section>
  );
};

export default compose(
  withProps(({ data, id }) => {
    return {
      question: data.questions[id]
    };
  })
)(Question);
