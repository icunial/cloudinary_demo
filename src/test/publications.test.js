const request = require("supertest");
const app = require("../../index");
const db = require("../db");

const fs = require("fs-extra");

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

let publication1_id, publication2_id;

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
    publication1_id = response.body.data.id;
  });
});

describe("POST /publications route -> create new publication with image", () => {
  it("it should return 201 status code -> new publication success with image", async () => {
    const publication = {
      title: "Publication 2",
      description: "Description Publication 2",
    };

    const response = await request(app)
      .post("/publications")
      .field("title", publication.title)
      .field("description", publication.description)
      .attach("image", `${__dirname}/publication1.jpg`);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 2");
    expect(response.body.data.description).toBe("Description Publication 2");
    publication2_id = response.body.data.id;
  });
});

describe("PUT /publications/image/remove/:id route -> delete publication image", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).put("/publications/image/remove/1");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
});
