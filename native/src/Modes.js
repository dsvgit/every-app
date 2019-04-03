import React from "react";
import { withProps, compose } from "recompose";
import { Link } from "react-router-native";
import { View, Text } from "react-native";

const Modes = ({ topic }) => {
  return (
    <View>
      <View>
        <Link to={`/`}>
          <Text>{"<"} Назад</Text>
        </Link>
      </View>
      <Text>{topic.title}</Text>
      <Text>Выберите режим</Text>
      <View>
        <View>
          <Link to={`/quiz/exam/${topic.id}`}>
            <Text>Экзамен</Text>
          </Link>
        </View>
        <View>
          <Link to={`/quiz/all/${topic.id}`}>
            <Text>Все вопросы</Text>
          </Link>
        </View>
      </View>
    </View>
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
