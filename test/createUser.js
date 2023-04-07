const server = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const { Users } = require("../models");

chai.use(chaiHttp);

describe("User Controller", () => {
  describe("createUser", () => {
    before(async () => {
      //Delete all users before starting the createUser test
      await Users.destroy({ truncate: true });
    });

    it("should create a new user", async () => {
      const user = {
        name: "Laiba Saeed",
        phone_number: "03115366822",
      };
      const res = await chai.request(server).post("/api/v1/users").send(user);
      expect(res).to.have.status(200);
      expect(res.body.message).to.have.equal("User Created");
    });

    it("should return an error if name is missing", async () => {
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send({ phone_number: "03115366822" });
      expect(res).to.have.status(400);
      expect(res.body.error).to.have.equal("Missing name or phone_number");
    });

    it("should return an error if phone_number is missing", async () => {
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send({ name: "Laiba Saeed" });
      expect(res).to.have.status(400);
      expect(res.body.error).to.have.equal("Missing name or phone_number");
    });

    it("should return an error if phone_number is not unique", async () => {
      const user = {
        name: "Laiba Saeed",
        phone_number: "03115366822",
      };
      await chai.request(server).post("/api/v1/users").send(user);
      const res = await chai.request(server).post("/api/v1/users").send(user);
      expect(res).to.have.status(500);
      expect(res.body.error.message).to.have.equal("Validation error");
    });

    after(async () => {
      await Users.destroy({ truncate: true });
    });
  });
});
