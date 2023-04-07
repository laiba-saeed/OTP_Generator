const server = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const { Users } = require("../models");

chai.use(chaiHttp);

describe("User Controller", () => {
  describe("generateOTP", () => {
    before(async () => {
      //Delete all users before starting the test
      await Users.destroy({ truncate: true });
    });

    it("should return an error if phone_number is missing", async () => {
      const res = await chai
        .request(server)
        .post("/api/v1/users/generateOTP")
        .send();
      expect(res).to.have.status(400);
      expect(res.body.error).to.have.equal("phone_number is missing");
    });

    it("should return an error if user is not found", async () => {
      const res = await chai
        .request(server)
        .post("/api/v1/users/generateOTP")
        .send({ phone_number: "03115636822" });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error").equal("User not found");
    });

    it("should generate a 4-digit OTP and save it to the user record", async () => {
      const user = await Users.create({
        name: "Laiba Saeed",
        phone_number: "03115636822",
      });
      const res = await chai
        .request(server)
        .post("/api/v1/users/generateOTP")
        .send({ phone_number: user.phone_number });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("user_id").equal(user.id);
    });

    after(async () => {
      const user = await Users.findOne({
        where: { phone_number: "03115636822" },
      });
      await Users.destroy({ where: { id: user.id } });
    });
  });
});
