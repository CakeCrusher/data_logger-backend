import { Request, Response } from 'express';
import { createTableBody, fetchGraphQL } from '../helperFunctions';
import { CREATE_CTFIELD, CREATE_CUSTOMTABLE } from '../schemas';
import { TableInput, TCFields } from '../types';
const fetch = require('node-fetch');
var AuthenticationClient = require('auth0').AuthenticationClient;



const getAuthManagagementApiToken = async () => {
  const promise = new Promise ((resolve, reject) => {
    var auth0 = new AuthenticationClient({
      domain: process.env.AUTH_DOMAIN,
      clientId: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
    });
    auth0.clientCredentialsGrant(
      {
        audience: `https://${process.env.AUTH_DOMAIN}/api/v2/`,
      },
      function(err:any, response:any) {
        if (err) {
          console.log('ERROR: ', err);
        } else {
          console.log('response.access_token: ', response.access_token.slice(0,10));
          resolve(response.access_token)
        }
      }
    );
  })
  const managementApiToken = await promise
  return managementApiToken
}

const getProfileInfo = async (user_id: string) => {

  const managementApiToken = Boolean(process.env.DEVELOPMENT) ? process.env.AUTH_MANAGEMENT_API_TOKEN : await getAuthManagagementApiToken()
  
  const AUTH0_DOMAIN = process.env.AUTH_DOMAIN
  const headers = {'Authorization': `Bearer ${managementApiToken}`}
  const profileAPI = `https://${AUTH0_DOMAIN}/api/v2/users/${user_id}`
  
  const profileInfo = await fetch(profileAPI, {headers}).then((res: any) => res.json())
  return profileInfo
}

export const auth0 = async (req: Request, res: Response) => {
  const { session_variables } = req.body
  
  const user_id = session_variables['x-hasura-user-id']
  const profileInfo = await getProfileInfo(user_id)
  console.log(profileInfo);
  
  return res.json({
    id: profileInfo.user_id,
    name: profileInfo.nickname,
    email: profileInfo.email,
  })
}

export const createTable = async (req: Request, res: Response) => {
  console.log('creating table');
  
  const user_id = req.body.session_variables['x-hasura-user-id']
  const input: TableInput = req.body.input

  const createCustomTableRes = await fetchGraphQL(CREATE_CUSTOMTABLE, {
    name: input.name,
    user_id
  })
  if (!createCustomTableRes.data) {
    return res.status(401)
  }
  const customTableId = createCustomTableRes.data.insert_customtable.returning[0].id
  console.log('customTableId: ', customTableId);
  

  console.log(createCustomTableRes);
  

  await input.fields.forEach(async (field: TCFields) => {
    const res = await fetchGraphQL(CREATE_CTFIELD, {
      label: field.label,
      type: field.type,
      customtable: customTableId,
    })
    console.log('made field');
    
    if (!res.data) {
      return res.status(401)
    }
  })

  const createTableRes = await fetch('https://data-logger.hasura.app/v1/query', {
    method: 'POST',
    body: JSON.stringify(createTableBody(input, user_id)),
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": "3fVAMs0P7prKMOzAUb4uUoJF9eTrbPTh0X9sqe6vGnECNT0AHa3Bkyndf81V6pS4"
    }
  })
  console.log('made table res: ', createTableRes);
  

  
  
  return res.json({
    tableName: `${user_id}_${input.name}`,
  })
}