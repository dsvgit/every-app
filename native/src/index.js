import React from "react";
import { NativeRouter as Router, Route } from "react-router-native";
import { compose, lifecycle, branch } from "recompose";
import { Provider, connect } from "react-redux";
import { View } from "react-native";

import Topics from "src/components/Topics";
import Modes from "src/components/Modes";
import Exam from "src/components/Quiz/Exam";
import AllQuestions from "src/components/Quiz/AllQuestions";
import Spinner from "src/components/Spinner";
import Header from "src/components/Header";
import { fetchData, getStatus } from "src/data/duck";
import { SUCCESS } from "src/data/constants";
import store from "src/data/store";

const AppComponent = () => {
  return (
    <Router>
      <Route path="/" exact component={Topics} />
      <Route path="/modes/:topicId" component={Modes} />
      <Route path="/quiz/exam/:topicId" component={Exam} />
      <Route path="/quiz/all/:topicId" component={AllQuestions} />
    </Router>
  );
};

const App = compose(
  connect(
    state => ({
      status: getStatus("fetchData", state)
    }),
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
      <View style={{ flex: 1 }}>
        <Header title={"АККРЕДИТАЦИЯ"} />
        <View style={{ flex: 1, alignItems: "center", paddingTop: 48 }}>
          <Spinner size={48} />
        </View>
      </View>
    )
  )
)(AppComponent);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
