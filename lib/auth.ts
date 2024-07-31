"use server";

import axios from "axios";
import qs from "qs";

class APIError extends Error {
  data: any;

  constructor(message: string, data: any = null) {
    super(message);
    this.data = data; // This could be the raw error data from the API for debugging purposes.
  }
}

interface TokenData {
  token_type: string;
  access_token: string;
}

const stringToBase64 = (input: string): string => {
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(input);

  let base64 = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  for (let i = 0; i < byteArray.length; i += 3) {
    const byte1 = byteArray[i];
    const byte2 = byteArray[i + 1] || 0; // Use 0 if byte is undefined
    const byte3 = byteArray[i + 2] || 0; // Use 0 if byte is undefined

    const index1 = byte1 >> 2;
    const index2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    const index3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    const index4 = byte3 & 63;

    base64 += characters[index1] + characters[index2];
    base64 += i + 1 < byteArray.length ? characters[index3] : "=";
    base64 += i + 2 < byteArray.length ? characters[index4] : "=";
  }

  return base64;
};

const getAuthentication = async (
  token_endpoint: string,
  basic_auth: string,
  grant_type: string,
  scope: string
): Promise<string> => {
  const tokenData = (await axios({
    method: "post",
    url: token_endpoint,
    headers: {
      Authorization: basic_auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      grant_type: grant_type,
      scope: scope,
    }),
  })
    .then((response) => response.data)
    .catch((error) => {
      error.response.data.status = error.response.status;
      throw new APIError(
        "Failed to authenticate your client. Try checking your OAuthClientID and your OAuthClientSecret. More information about API Clients can be found here: https://kb.ministryplatform.com/kb/develop/oauth-2-0"
        // error.response.data
      );
    })) as TokenData;

  return `${tokenData.token_type} ${tokenData.access_token}`;
};

export const createWebApiClient = async (
  grant_type: string = "client_credentials",
  scope: string = "http://www.thinkministry.com/dataplatform/scopes/all"
) => {
  const { OAuthClientID, OAuthClientSecret, OAuthBaseAddress, ServiceAddress } =
    process.env;
  if (!OAuthClientID)
    throw new APIError("Missing Required Environment Variable: OAuthClientID", {
      msg: "Make sure to include 'OAuthClientID' in your environment variables. This value should be your Client_ID for the API Client you want to use. This table can be found under Administration called 'API Clients'.",
    });
  if (!OAuthClientSecret)
    throw new APIError(
      "Missing Required Environment Variable: OAuthClientSecret",
      {
        msg: "Make sure to include 'OAuthClientSecret' in your environment variables. This value should be your Client_Secret for the API Client you want to use. This table can be found under Administration called 'API Clients'.",
      }
    );
  if (!OAuthBaseAddress)
    throw new APIError(
      "Missing Required Environment Variable: OAuthBaseAddress",
      {
        msg: "Make sure to include 'OAuthBaseAddress' in your environment variables. This value should be your discovery URL. More information on your discovery URL can be found here: https://kb.ministryplatform.com/kb/develop/oauth-2-0",
      }
    );
  if (!ServiceAddress)
    throw new APIError(
      "Missing Required Environment Variable: ServiceAddress",
      {
        msg: "Make sure to include 'ServiceAddress' in your environment variables. This value should be your platform api url. More information on your platform api url can be found here: https://kb.ministryplatform.com/kb/develop/rest-api",
      }
    );

  const isSubset = (master: string[], sub: string[]) =>
    !sub.some((string) => master.indexOf(string) === -1);

  const OAuthDiscovery = await axios({
    method: "get",
    url: OAuthBaseAddress,
  })
    .then((response) => response.data)
    .catch((error) => {
      error.response.data.status = error.response.status;
      throw new APIError(
        "Failed to retrieve data from OAuthBaseAddress. This value should be your discovery URL. More information on your discovery URL can be found here: https://kb.ministryplatform.com/kb/develop/oauth-2-0",
        error.response.data
      );
    });

  const service_address = ServiceAddress;
  const token_endpoint = OAuthDiscovery.token_endpoint;
  const basic_auth = `Basic ${stringToBase64(
    `${OAuthClientID}:${OAuthClientSecret}`
  )}`;

  if (!isSubset(OAuthDiscovery.scopes_supported, scope.split(" "))) {
    throw new APIError("Invalid scope detected", {
      msg: `The scope '${scope}' is not valid. Here is the list of valid scopes: ${OAuthDiscovery.scopes_supported.join(
        ", "
      )}`,
    });
  }
  if (!isSubset(OAuthDiscovery.grant_types_supported, [grant_type])) {
    throw new APIError("Invalid grant type detected", {
      msg: `The grant type '${grant_type}' is not valid. Here is the list of valid grant types: ${OAuthDiscovery.grant_types_supported.join(
        ", "
      )}`,
    });
  }

  const domain = await axios({
    method: "get",
    url: `${service_address}/domain`,
    headers: {
      Authorization: await getAuthentication(
        token_endpoint,
        basic_auth,
        grant_type,
        scope
      ),
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      error.response.data.status = error.response.status;
      throw new APIError(
        "Failed to retrieve domain data from authenticated user. Make sure the Client User on your API Client has security roles. More information about API Client Permissions can be found here: https://kb.ministryplatform.com/kb/develop/giving-developers-access",
        error.response.data
      );
    });

  return {
    service_address,
    token_endpoint,
    basic_auth,
    grant_type,
    scope,
    domain,
  };
};

const serviceAddress = process.env.ServiceAddress;
const scope = "http://www.thinkministry.com/dataplatform/scopes/all";
const grant_type = "client_credentials";
const basic_auth = `Basic ${stringToBase64(
  `${process.env.OAuthClientID}:${process.env.OAuthClientSecret}`
)}`;

export const request = async (
  method: string,
  path: string,
  query?: any,
  body?: any
) => {
  const OAuthDiscovery = await axios({
    method: "get",
    url: process.env.OAuthBaseAddress,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new APIError(
        "Failed to retrieve data from OAuthBaseAddress. This value should be your discovery URL. More information on your discovery URL can be found here: https://kb.ministryplatform.com/kb/develop/oauth-2-0"
        // error.response.data
      );
    });

  const token_endpoint = OAuthDiscovery.token_endpoint;

  return await axios({
    method: method,
    url: serviceAddress + path,
    headers: {
      Authorization: await getAuthentication(
        token_endpoint!,
        basic_auth!,
        grant_type!,
        scope!
      ),
      "Content-Type": "application/json",
    },
    params: query,
    data: body,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error", error.response.data);
    });
};
