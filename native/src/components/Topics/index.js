import React from "react";
import { withProps, compose } from "recompose";
import * as R from "ramda";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";
import { ListItem } from 'react-native-elements'

import Header from "src/components/Header";
import { getData } from "src/data/duck";

const Topics = ({ topics, history }) => {
  return (
    <View style={{flex: 1}}>
      <Header title={"EVERYKA APP"} />
      <FlatList
        data={R.values(topics)}
        keyExtractor={topic => topic.id}
        renderItem={({ item: topic }) => (
          <ListItem
            key={topic.id}
            title={topic.title}
            onPress={() => history.push(`/modes/${topic.id}`)}
            chevron
            bottomDivider
          />
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
