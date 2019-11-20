import * as R from "ramda";

export const mapResponseToData = data => {
  const { Item1, Item2, Item3 } = data;

  const assessmentItems = R.compose(
    R.indexBy(R.prop("id")),
    R.map(item => ({
      id: item.Id,
      questionIds: R.map(R.prop("ItemId"), item.GetAllVersionIds),
      assessmentRevisionId: item.AssessmentRevisionId
    }))
  )(Item2);

  const topics = R.compose(
    R.indexBy(R.prop("id")),
    R.map(item => ({
      id: item.Id,
      title: item.AssessmentSettings.Title
    }))
  )(Item1);

  const questions = R.compose(
    R.indexBy(R.prop("id")),
    R.map(item => {
      return {
        id: item.ItemId,
        title: item.Question,
        data: {
          choices: R.map(
            choice => ({
              id: choice.Id,
              title: choice.Text
            }),
            item.Choices
          ),
          correctId: R.find(choice => choice.IsCorrect, item.Choices).Id
        },
        topic:
          topics[
            R.find(
              assessmentItem =>
                R.includes(item.ItemId, assessmentItem.questionIds),
              R.values(assessmentItems)
            ).assessmentRevisionId
          ]
      };
    })
  )(Item3);

  return { topics, questions };
};
