import React from 'react';
import { NativeRouter as Router, Route } from 'react-router-native';
import { lifecycle, withState, compose } from 'recompose';
import axios from 'axios';
import * as R from 'ramda';
import { View, Text } from 'react-native';

import Topics from './Topics';
import Quiz from './Quiz';
import Modes from './Modes';
import { host } from './config';

const AppComponent = ({ data }) => {
  return data ? (
    <Router>
      <Route
        path="/"
        exact
        component={props => <Topics {...props} data={data} />}
      />
      <Route
        path="/modes/:topicId"
        component={props => <Modes {...props} data={data} />}
      />
      <Route
        path="/quiz/:mode/:topicId"
        component={props => <Quiz {...props} data={data} />}
      />
    </Router>
  ) : (
    <View><Text>загрузка...</Text></View>
  );
};

const App = compose(
  withState('data', 'setData', undefined),
  lifecycle({
    async componentDidMount() {
      const { setData } = this.props;

      const [topics, questions] = R.map(
        response => response.data,
        await Promise.all([
          axios.get(`${host}/topics`),
          axios.get(`${host}/questions`)
        ])
      );

      setData({
        topics: R.indexBy(x => x.id, topics),
        questions: R.indexBy(x => x.id, questions)
      });
    }
  })
)(AppComponent);

export default App;
