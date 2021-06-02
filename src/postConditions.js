import axios from 'axios';
import dotenv from 'dotenv';
import { getNonProdConditions } from './getNonProdConditions';

dotenv.config();

const { API_KEY, POLICY_ID_PROD, POLICY_ID_PREPROD, BASE_URL } = process.env;

const postCondition = async (url, data) => {
  try {
    await axios({
      method: 'POST',
      url,
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        nrql_condition: data
      },
    });
  } catch (e) {
    console.error('Post method failed with status', e.statusCode);
    throw e;
  }
}


export const postConditions = async () => {
  
  const preProdUrl = `${BASE_URL}alerts_nrql_conditions/policies/${POLICY_ID_PREPROD}.json`;
  const prodUrl = `${BASE_URL}alerts_nrql_conditions/policies/${POLICY_ID_PROD}.json`;

  const { nrql_conditions } = await getNonProdConditions();
  
  await Promise.all(nrql_conditions.map(async (condition) => {
    delete condition.id;
   
    try {
      await postCondition(preProdUrl, condition);
    } catch (e) {
      console.error('Post to Pre-Prod failed with status', e.statusCode);
      throw e;
    }

    try {
      await postCondition(prodUrl, condition);
    } catch (e) {
      console.error('Post to Prod failed with status', e.statusCode);
      throw e;
    }
  }));
}