import * as AWS from "aws-sdk";

export const readSSM = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const ssm = new AWS.SSM();
    const params = {
      Name: process.env.SSM_PARAMETER!,
      WithDecryption: true,
    };

    ssm.getParameter(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const value = data.Parameter!.Value!;
        const lines = value.split("\n");
        lines
          .filter((line) => line !== "")
          .map((line) => line.split("="))
          .filter((keyval) => keyval.length >= 2)
          .forEach((keyval) => {
            let value = "";
            for (let i = 0; i < keyval.length; i++) {
              if (i === 0) {
                continue;
              }
              if (i > 1) {
                value += "=";
              }
              value += keyval[i];
            }
            console.log(`${keyval[0]}=${value}`);
            process.env[keyval[0]] = value;
          });
        resolve();
      }
    });
  });
};
