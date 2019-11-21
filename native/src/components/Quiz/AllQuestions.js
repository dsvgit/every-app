import React from "react";
import { compose, lifecycle } from "recompose";
import * as R from "ramda";
import {FlatList, View} from "react-native";
import { connect } from "react-redux";

import Question from "./Question";
import PlainText from "src/components/PlainText";
import ArrowBackIcon from "src/components/ArrowBackIcon";
import Header from "src/components/Header";
import {
  getTopic,
  getTopicQuestionIds,
  isTopicEmpty,
  resetQuiz
} from "src/data/duck";

const AllQuestions = ({ topic, questionIds, isTopicEmpty, history }) => {
  let content = null;

  if (isTopicEmpty) {
    content = (
      <View>
        <PlainText>По выбранной специальности нет вопросов</PlainText>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={questionIds}
        keyExtractor={id => id}
        renderItem={({ item: id }) => (
          <Question key={id} questionId={id} />
        )}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={topic.title}
        leftComponent={<ArrowBackIcon onPress={() => history.goBack()} />}
      />
      {content}
    </View>
  );
};

export default compose(
  connect(
    (state, { match }) => ({
      topic: getTopic(match.params.topicId, state),
      questionIds: getTopicQuestionIds(match.params.topicId, state),
      isTopicEmpty: isTopicEmpty(match.params.topicId, state)
    }),
    { resetQuiz }
  ),
  lifecycle({
    componentWillUnmount() {
      const { resetQuiz } = this.props;
      resetQuiz();
    }
  })
)(AllQuestions);
