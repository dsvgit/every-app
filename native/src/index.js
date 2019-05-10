import React from "react";
import { NativeRouter as Router, Route } from "react-router-native";
import { compose, lifecycle, branch } from "recompose";
import { Provider, connect } from "react-redux";
import { View } from "react-native";

import Topics from "src/components/Topics";
import Quiz from "src/components/Quiz";
import Modes from "src/components/Modes";
import PlainText from "src/components/PlainText";
import { fetchData } from "src/data/duck";
import { SUCCESS } from "src/data/constants";
import store from "src/data/store";

const AppComponent = () => {
  return (
    <Router>
      <Route path="/" exact component={Topics} />
      <Route path="/modes/:topicId" component={Modes} />
      <Route path="/quiz/:mode/:topicId" component={Quiz} />
    </Router>
  );
};

const App = compose(
  connect(
    state => ({ status: state.status }),
    {
      fetchData
    }
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchData();
    }
  }),
  branch(
    ({ status }) => status !== SUCCESS,
    () => () => (
      <View>
        <PlainText>загрузка...</PlainText>
      </View>
    )
  )
)(AppComponent);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
