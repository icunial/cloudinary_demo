const request = require("supertest");
const app = require("../index");
const db = require("../db");

beforeAll(async () => {
  await db.sync({ force: true });
  // await Product.truncate()
});

afterAll((done) => {
  db.close();
  done();
});
