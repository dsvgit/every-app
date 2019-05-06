import React from "react";
import { withProps, compose } from "recompose";
import { Link } from "react-router-native";
import { View, Text, FlatList } from "react-native";
import { connect } from "react-redux";

import { getData } from "src/data/duck";
import Header from "src/components/Header";
import ArrowBackIcon from "src/components/ArrowBackIcon";

const Modes = ({ topic, history }) => {
  return (
    <View>
      <Header
        title={topic.title}
        leftComponent={<ArrowBackIcon onPress={() => history.goBack()} />}
      />
      <Text>Выберите режим: </Text>
      <FlatList
        data={[
          { title: "Экзамен", url: "/quiz/exam/" },
          { title: "Все вопросы", url: "/quiz/all/" }
        ]}
        keyExtractor={(mode, index) => index}
        renderItem={({ item: mode }) => (
          <Link
            style={{
              flex: 1,
              height: 40,
              justifyContent: "center",
              paddingHorizontal: 20
            }}
            key={mode.id}
            to={`${mode.url}${topic.id}`}
          >
            <Text>{mode.title}</Text>
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
  withProps(({ data, match }) => {
    const topicId = match.params.topicId;

    return {
      topic: data.topics[topicId]
    };
  })
)(Modes);
