const chai = require("chai");
const chaiHttp = require("chai-http");
const moment = require("moment");
const { Users } = require("../models");
const server = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("User OTP verification", () => {
  let testUser;

  before(async () => {
    // Create a test user before running the tests
    await Users.destroy({ truncate: true });
    testUser = await Users.create({
      name: "Laiba Saeed",
      phone_number: "03115636822",
      otp: "7454",
      otp_expiration_date: moment().subtract(1, "minute").toDate(),
    });
  });

  it("should return an error if OTP is missing", async () => {
    const res = await chai
      .request(server)
      .get(`/api/v1/users/${testUser.id}/verifyOTP`);

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Otp is required");
  });

  it("should return an error if user is not found", async () => {
    const res = await chai
      .request(server)
      .get("/api/v1/users/9999/verifyOTP")
      .query({ otp: "7454" });

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal("User not found");
  });

  it("should return an error if OTP is incorrect", async () => {
    const res = await chai
      .request(server)
      .get(`/api/v1/users/${testUser.id}/verifyOTP`)
      .query({ otp: "1294" });

    expect(res.status).to.equal(401);
    expect(res.body.error).to.equal("Incorrect OTP");
  });

  it("should return an error if OTP has expired", async () => {
    const res = await chai
      .request(server)
      .get(`/api/v1/users/${testUser.id}/verifyOTP`)
      .query({ otp: "7454" });
    expect(res.status).to.equal(410);
    expect(res.body.error).to.equal("OTP expired");
  });

  it("should clear OTP and expiration date from user record if OTP is correct and not expired", async () => {
    const expiration_date = moment().add(7, "minutes");
    testUser.otp_expiration_date = expiration_date;
    await testUser.save();

    const res = await chai
      .request(server)
      .get(`/api/v1/users/${testUser.id}/verifyOTP`)
      .query({ otp: "7454" });

    expect(res.status).to.equal(201);
    expect(res.body.otp).to.be.null;
    expect(res.body.otp_expiration_date).to.be.null;
  });

  after(async () => {
    await testUser.destroy();
  });
});
