const request = require("supertest");
const app = require("../../index");
const db = require("../db");

beforeAll(async () => {
  await db.sync({ force: true });
  // await Product.truncate()
});

afterAll((done) => {
  db.close();
  done();
});

describe("POST /publications route -> create new publication validations", () => {
  {
    it("it should return 400 status code -> title parameter is missing", async () => {
      const publication = {
        description: "Description",
      };

      const response = await request(app)
        .post("/publications")
        .send(publication);
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Title parameter is missing");
    });
    it("it should return 400 status code -> title must be a string", async () => {
      const publication = {
        title: 1234,
        description: "Description",
      };

      const response = await request(app)
        .post("/publications")
        .send(publication);
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Title must be a string");
    });
  }
});
