import { mapResponseToData } from "./mapping";
import mock_data from './mock_data';

describe("mapping", () => {
  it("test", () => {
    console.log(JSON.stringify(mapResponseToData(mock_data), null, 1));
  });
});
