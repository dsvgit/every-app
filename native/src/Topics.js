import React from "react";
import { withProps, compose } from "recompose";
import { Link } from "react-router-native";
import * as R from "ramda";
import { View, Text } from "react-native";

const Topics = ({ topics }) => {
  return (
    <View>
      <Text>АККРЕДИТАЦИЯ</Text>
      <Text>Выберите специальность</Text>
      <View>
        {R.map(
          topic => (
            <View key={topic.id}>
              <Link to={`/modes/${topic.id}`}>
                <Text>{topic.title}</Text>
              </Link>
            </View>
          ),
          R.values(topics)
        )}
      </View>
    </View>
  );
};

export default compose(
  withProps(({ data }) => ({
    topics: data.topics
  }))
)(Topics);
