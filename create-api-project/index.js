module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  require("dotenv").config();
  const axios = require("axios");
  var json = "";

  //RapiAPI Rest PAPI Settings
  const rOwnerID = process.env.OWNER_ID; //Team Number for the Governance Team you will create
  const rUrl = process.env.REST_URL;
  const rHost = process.env.REST_HOST;
  const rKey = process.env.REST_KEY; // needs to be the team key

  //Azure Settings
  const azureServiceGateway = process.env.AZURE_SERVICE_GATEWAY;
  const azureGatewayName = azureServiceGateway.toLowerCase();
  const azureBaseUrl = "https://" + azureGatewayName + ".management.azure-api.net";
  const azureResourceGroup = process.env.AZURE_RESOURCE_GROUP;
  const azureProvider = process.env.AZURE_PROVIDER_NAME;
  const azureAPIversion = process.env.AZURE_API_VERSION;

  //Azure Subscription Details
  const azureSubscription = process.env.AZURE_SUBSCRIPTION;
  const azureSharedAccessKey = process.env.AZURE_SHARED_ACCESS_KEY;

  // Process Form Data
  const FILENAME = "openapi.json";
  const FormData = require("form-data");
  const formData = new FormData();
  formData.append("ownerId", rOwnerID);

  //Create Azure Connection
  let azurePlatformApi = axios.create({
    baseURL: azureBaseUrl,
    headers: {
      Authorization: azureSharedAccessKey,
    },
  });

  async function createHubListing(OAS) {
    console.log("Prepping OAS to create Hub Listing");

    //prep OAS payload with x-category
    let file = JSON.parse(OAS);
    file.info["x-thumbnail"] =
      "https://rapidapi-prod-apis.s3.amazonaws.com/b998e130-a178-41af-9c6b-2c636466ea8f.png";

    if (!file.info["x-category"]) file.info["x-category"] = "Other";
    file = JSON.stringify(file);
    console.log(">>> Added Catergory: ", file);
    formData.append("file", file, FILENAME);

    axios
      .post(rUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          "x-rapidapi-host": rHost,
          "x-rapidapi-key": rKey,
        },
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error.response.data);
      });
  }

  async function getApiSpec(apiName) {
    let options = {
      headers: {
        Authorization: azureSharedAccessKey,
      },
    };

    try {
      let response = await azurePlatformApi.get(
        `subscriptions/${azureSubscription}/resourceGroups/${azureResourceGroup}/providers/${azureProvider}/service/${azureServiceGateway}/apis/${apiName}`,
        {
          params: {
            format: "openapi+json",
            export: "true",
            "api-version": azureAPIversion,
          },
          options,
        }
      );

      //Get OAS file from response data
      json = JSON.stringify(response.data.properties.value);
      return json;
    } catch (e) {
      console.log(`Failed to get spec []:\n${JSON.stringify(e.response.data)}`);

      return null;
    }
  }

  async function processApiEvent(apiName) {
    // Get API Spec
    console.log("Getting API SPEC");
    const azureOASSpec = await getApiSpec(apiName);

    // Create API Listing
    console.log("Creating Hub Listing");
    createHubListing(azureOASSpec);
  }

  // Code to get the API Name from the Azure APIM Event Grid
  const subject = req.body.subject;

  if (!req.body) {
    return res.sendStatus(400);
  }

  const regex2 = "/.*./(.*);.*";
  apiRegex = subject.match(regex2);
  apiName = apiRegex[1];

  context.res = {
    body: apiName,
  };

  processApiEvent(apiName);
};
