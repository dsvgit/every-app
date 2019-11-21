import React from "react";
import { compose } from "recompose";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";
import { ListItem } from "react-native-elements";

import { getTopic } from "src/data/duck";
import Header from "src/components/Header";
import ArrowBackIcon from "src/components/ArrowBackIcon";

const Modes = ({ topic, history }) => {
  return (
    <View style={{flex: 1}}>
      <Header
        title={topic.title}
        leftComponent={<ArrowBackIcon onPress={() => history.goBack()} />}
      />
      <FlatList
        data={[
          { title: "Экзамен", url: "/quiz/exam/" },
          { title: "Все вопросы", url: "/quiz/all/" }
        ]}
        keyExtractor={(mode, index) => String(index)}
        renderItem={({ item: mode }) => (
          <ListItem
            key={mode.id}
            title={mode.title}
            onPress={() => history.push(`${mode.url}${topic.id}`)}
            chevron
            bottomDivider
          />
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
