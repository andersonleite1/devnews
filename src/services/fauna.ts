import { Client } from "faunadb"; 'faunadb';

const FAUNA_SECRET_KEY = process.env.FAUNA_SECRET_KEY || "";

const faunaClient = new Client({
  secret: FAUNA_SECRET_KEY,
});
