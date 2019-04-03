import React from 'react';
import { withProps, compose } from 'recompose';
import * as R from 'ramda';

import Question from './Question';

const Quiz = ({
  data,
  questionIds,
  isTopicEmpty,
  answers,
  setAnswer,
  setCurrent
}) => {
  if (isTopicEmpty) {
    return <div>По выбранной специальности нет вопросов</div>;
  }

  return (
    <div>
      {R.map(
        id => (
          <Question
            data={data}
            answer={answers[id]}
            setAnswer={setAnswer}
            key={id}
            id={id}
          />
        ),
        questionIds
      )}
    </div>
  );
};

export default compose(
  withProps(({ data, topic }) => {
    const questionIds = R.map(
      x => x.id,
      R.filter(q => q.topic.id === topic.id, R.values(data.questions))
    );

    return {
      questionIds,
      isTopicEmpty: R.isEmpty(questionIds)
    };
  })
)(Quiz);
