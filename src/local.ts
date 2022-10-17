import { readSSM } from "./aws";
import { run } from "./faucet";

readSSM()
  .then(run)
  .then(() => {
    process.exit(0);
  });
