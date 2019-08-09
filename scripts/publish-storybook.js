require("../config/env");

/*
https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/
*/

const https = require("https");

const GITHUB_REF = process.env.GITHUB_REF || "";
const GITHUB_SHA = process.env.GITHUB_SHA || "";
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const post = () =>
  new Promise((resolve, reject) => {
    const sendData = JSON.stringify({
      name: "Preview",
      head_sha: GITHUB_SHA,
      status: "completed",
      conclusion: "success",
      html_url: "https://wetransfer.com/test-html",
      details_url: "https://wetransfer.com/test-details",
      output: {
        title: "Preview",
        summary: `Preview built for ${GITHUB_REF}`
      }
    });
    const requestParams = {
      hostname: `api.github.com`,
      path: `/repos/${GITHUB_REPOSITORY}/check-runs`,
      method: "POST",
      port: 443,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": sendData.length,
        "User-Agent": "PreviewBuilder",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.antiope-preview+json"
      }
    };

    const request = https.request(requestParams, response => {
      let body = "";

      response.on("data", chunk => {
        body += chunk;
      });

      response.on("end", async () => {
        let responseData = {};

        try {
          responseData = JSON.parse(body);
        } catch {
          console.warn("Unable to parse response body", body);
        }

        resolve({
          statusCode: response.statusCode,
          data: `Published Storybook`,
          details: responseData
        });
      });
    });

    request.on("error", reject);

    request.write(sendData);
    request.end();
  });

post()
  .then(response => {
    console.log("Response");
    console.log(response);
  })
  .catch(error => {
    console.log("Error");
    console.error(error);
  });
