import React from 'react';
import { withProps, compose } from 'recompose';
import { Link } from 'react-router-dom';
import * as R from 'ramda';

const Topics = ({ topics }) => {
  return (
    <div>
      <h2>АККРЕДИТАЦИЯ</h2>
      <h3>Выберите специальность</h3>
      <ul>
        {R.map(
          topic => (
            <li key={topic.id}>
              <Link to={`/modes/${topic.id}`}>{topic.title}</Link>
            </li>
          ),
          R.values(topics)
        )}
      </ul>
    </div>
  );
};

export default compose(
  withProps(({ data }) => ({
    topics: data.topics
  }))
)(Topics);
