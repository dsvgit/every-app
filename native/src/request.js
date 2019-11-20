import axios from "axios";

import { host } from "src/config";

const instance = axios.create({
  baseURL: host,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    Connection: 'close',
    'Content-type': 'application/json',
    Authorization:
      "Bearer AQAAANCMnd8BFdERjHoAwE_Cl-sBAAAA-TeAEcnCK0W-XNdMV1Z2TAAAAAACAAAAAAAQZgAAAAEAACAAAABFXj4nLbERzOY0AwG59p8qz34oGUxXwPP2wRkZLqOBgAAAAAAOgAAAAAIAACAAAACVBCZnyNAny5JyH9VtjuZWSYstcsVuTQvM3_7VYej6QvAAAACS7lrjkn6ACv5FBpLJL-ChT7p-YhJPsZtNBh2BmMMMIvJVGoB4weZ_8fi1z96f1lMExQmGdFZVNCg7ulEco20guMQqfjAePlREL5HrTEYBANarJK686rLn-KtvVCeRUsKh-0GEAn5MNYGmqB50FxXq8mpnwd11kvEAO9g5q8Hzb-c30kWUj5xMEQClYPxGVGSMp4Y5ollugCHPix7q9H-FXdjqwSmxEjEL5spUFT3XqdgAHoJoEDVHUpLe5AvVc_5r0q6g2DyBXlIwhTpURKC4dwKvQV0QBUPkSetjQYm2Y-8_m6Cn908zbKIwSWdcIhNAAAAA9trCmesojInoK3xiUj4vYRcDx2xRkPwySAYg4KnAwznprTkmwCduH_f04SxWCst3MclZA3NSUn9J19A4EFjc3A"
  }
});

export default instance;
