import { readSSM } from "aws";
import { run } from "./faucet";

type Request = {};

type Response = {};

exports.handler = async (req: Request): Promise<Response> => {
  try {
    await readSSM();
    await run();
  } catch (err: any) {
    console.log(`エラーが発生しました。 ${err}`);
  }
  return {};
};
