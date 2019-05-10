import React from "react";
import { compose } from "recompose";
import { Link } from "react-router-native";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";

import { getTopic } from "src/data/duck";
import Header from "src/components/Header";
import ArrowBackIcon from "src/components/ArrowBackIcon";
import PlainText from "src/components/PlainText";

const Modes = ({ topic, history }) => {
  return (
    <View>
      <Header
        title={topic.title}
        leftComponent={<ArrowBackIcon onPress={() => history.goBack()} />}
      />
      <PlainText>Выберите режим: </PlainText>
      <FlatList
        data={[
          { title: "Экзамен", url: "/quiz/exam/" },
          { title: "Все вопросы", url: "/quiz/all/" }
        ]}
        keyExtractor={(mode, index) => String(index)}
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
            <PlainText>{mode.title}</PlainText>
          </Link>
        )}
      />
    </View>
  );
};

export default compose(
  connect((state, { match }) => ({
    topic: getTopic(match.params.topicId, state)
  }))
)(Modes);
