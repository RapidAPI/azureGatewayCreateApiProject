# azureCreateApiProject
Demo Days code for creating an API Project in RapidAPI when an API is created on the Azure API Gateway

For addition deatails on this setup, please reach out to James De Luca for Azure Gaateway configuration and Code logic.

##Notion Documentaiton Link 
https://www.notion.so/rapidapi/Azure-API-Project-Creation-882b8a7dc38b4701a394faeb44c61f6b

Install the dotnev npm using the command in VS Code terminal "npm i dotenv"
Create a .env file and set the following values


Rapid REST PAPI Values:\
REST_HOST='{your-rest-platform-api-host}'\
REST_URL='{your-rest-platform-api-url}'\
REST_KEY='{your-rest-platform-api-key}'\
OWNER_ID='{the-id-of-the-api-owner}'

AZURE GATEWAY API Values:\
AZURE_SERVICE_GATEWAY='your-azure-api-gateway-name'\
AZURE_RESOURCE_GROUP='your-resource-group'\
AZURE_PROVIDER_NAME='Microsoft.ApiManagement'\
AZURE_API_VERSION='2021-12-01-preview'\
AZURE_SUBSCRIPTION='your 36-digit-azure subscription'\
AZURE_SHARED_ACCESS_KEY='your-shared-access-key-from-apim-service'
