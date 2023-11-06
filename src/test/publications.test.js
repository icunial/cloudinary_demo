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
    it("it should return 400 status code -> description parameter is missing", async () => {
      const publication = {
        title: "Publication 1",
      };

      const response = await request(app)
        .post("/publications")
        .send(publication);
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Description parameter is missing");
    });
    it("it should return 400 status code -> description must be a string", async () => {
      const publication = {
        title: "Publication 1",
        description: 1234,
      };

      const response = await request(app)
        .post("/publications")
        .send(publication);
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Description must be a string");
    });
  }
});

describe("POST /publications route -> create new publication without image", () => {
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 1",
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 1");
    expect(response.body.data.description).toBe("Description Publication 1");
  });
});
