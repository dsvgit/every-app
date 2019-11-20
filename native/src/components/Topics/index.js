import React from "react";
import { withProps, compose } from "recompose";
import { Link } from "react-router-native";
import * as R from "ramda";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";

import Header from "src/components/Header";
import PlainText from 'src/components/PlainText';
import { getData } from "src/data/duck";

const Topics = ({ topics }) => {
  return (
    <View>
      <Header title={"EVERYKA APP"} />
      <PlainText>Выберите специальность: </PlainText>
      <FlatList
        data={R.values(topics)}
        keyExtractor={topic => topic.id}
        renderItem={({ item: topic }) => (
          <Link
            style={{ flex: 1, height: 40, justifyContent: "center", paddingHorizontal: 20 }}
            key={topic.id}
            to={`/modes/${topic.id}`}
          >
            <PlainText>{topic.title}</PlainText>
          </Link>
        )}
      />
    </View>
  );
};

export default compose(
  connect(state => ({
    data: getData(state)
  })),
  withProps(({ data }) => ({
    topics: data.topics
  }))
)(Topics);
