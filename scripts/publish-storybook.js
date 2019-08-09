require("../config/env");

/*
https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/
*/

const https = require("https");

const GITHUB_REF = process.env.GITHUB_REF || "";
const GITHUB_SHA = process.env.GITHUB_SHA || "";
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

/*
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
*/
const post = (path, data) =>
  new Promise((resolve, reject) => {
    const sendData = JSON.stringify(data);
    const requestParams = {
      hostname: `api.github.com`,
      path,
      method: "POST",
      port: 443,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": sendData.length,
        "User-Agent": "PreviewBuilder",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.ant-man-preview+json"
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

        resolve(responseData);
      });
    });

    request.on("error", reject);

    request.write(sendData);
    request.end();
  });

const deploy = async () => {
  try {
    const createResponse = await post(
      `/repos/${GITHUB_REPOSITORY}/deployments`,
      {
        ref: GITHUB_SHA,
        required_contexts: [],
        transient_environment: false,
        environment: "preview"
      }
    );

    const updateResponse = await post(
      `/repos/${GITHUB_REPOSITORY}/deployments/${createResponse.id}`,
      {
        state: "success",
        environment: "preview",
        environment_url: `https://preview.wetransferalpha.com/${GITHUB_REF}`
      }
    );

    console.log("Response");
    console.log(
      JSON.stringify(
        { create: createResponse, update: updateResponse },
        null,
        4
      )
    );
  } catch (error) {
    console.log("Error");
    console.error(error);
    throw error;
  }

  return;
};
deploy()
  .then(() => {
    console.log("Done");
  })
  .catch(error => {
    console.log("Error");
    console.error(error);
  });
