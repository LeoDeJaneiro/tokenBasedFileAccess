const { MongoClient } = require("mongodb");
const request = require("supertest");
const app = require("../app");

const entity = {
  _id: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  expiresAt: expect.any(String),
  user: expect.any(String),
  usageCount: expect.any(Number),
};

describe("token", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    const tokens = db.collection("tokens");

    const mockUser = { _id: "some-user-id", name: "John" };
    await tokens.insertOne(mockUser);
  });

  afterAll(async () => {
    // await db.close();
    await connection.close();
  });

  it("should get all", () => {
    return request(app)
      .get("/api/v1/token")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([expect.objectContaining(entity)])
        );
      });
  });
  it("should get one", () => {
    return request(app)
      .get("/api/v1/token/614e1d64bea27e7b2b8545d1")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining(entity));
      });
  });
  it("should return 400", () => {
    return request(app).get("/api/v1/token/6789").expect(400);
  });
  it("should delete", () => {});
  it("should update", () => {});
  it("should post", () => {});
});
