import React from 'react';
import { withProps, compose } from 'recompose';
import { Link } from 'react-router-dom';

const Modes = ({ topic }) => {
  return (
    <div>
      <p>
        <Link to={`/`}>{'<'} Назад</Link>
      </p>
      <h2>{topic.title}</h2>
      <h3>Выберите режим</h3>
      <ul>
        <li>
          <Link to={`/quiz/exam/${topic.id}`}>Экзамен</Link>
        </li>
        <li>
          <Link to={`/quiz/all/${topic.id}`}>Все вопросы</Link>
        </li>
      </ul>
    </div>
  );
};

export default compose(
  withProps(({ data, match }) => {
    const topicId = match.params.topicId;

    return {
      topic: data.topics[topicId]
    };
  })
)(Modes);
