import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';


dotenv.config();

const { API_KEY, POLICY_ID_NONPROD, BASE_URL } = process.env;

export const getNonProdConditions = async () => {

  const url = `${BASE_URL}alerts_nrql_conditions.json?policy_id=${POLICY_ID_NONPROD}`;

  const { data } = await axios({
    method: 'GET',
    url,
    headers: {
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const filePath = path.join(__dirname, 'conditions', 'conditions.json');

  await writeFile(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
  
  return data;
}
