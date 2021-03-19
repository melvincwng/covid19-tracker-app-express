const app = require("../src/app");
const request = require("supertest");
const dbHandlers = require("../test/dbHandler");
const User = require("../src/models/user.model")

describe("users routes", () => {
  beforeAll(async () => await dbHandlers.connect());

  beforeEach(async () => {
    const userData = [
      {
        username: "user1",
        password: "testing123",
      },
      {
        username: "user2",
        password: "testing456",
      },
    ];
    await User.create(userData);
  });

  afterEach(async () => await dbHandlers.clearDatabase());

  afterAll(async () => await dbHandlers.closeDatabase());

  describe.skip("POST /users", () => {
    it("should create a new user & return it if fields are valid", async () => {
        const newUser = { username:"user3", password:"testing123" };
        const response = await request(app).post("/users").send(newUser).expect(201)

        expect(response.status).toBe(201);
        expect(Object.keys(response.body).length).toBe(4);
        expect(response.body.username).toBe(newUser.username);
    });

    it("should throw error if name is empty", async () => {
        const newUser = { username: "", password:"testing123" };
        const response = await request(app).post("/users").send(newUser).expect(500);

        expect(response.status).toBe(500);
    });

    it("should throw error if name is too short", async () => {
        const newUser = { username: "a", password:"testing123" };
        const response = await request(app).post("/users").send(newUser).expect(500);

        expect(response.status).toBe(500);
    });

    it("should throw error if password is too short", async () => {
        const newUser = { username: "user3", password:"t" };
        const response = await request(app).post("/users").send(newUser).expect(500);

        expect(response.status).toBe(500);
    });
  });

  describe("POST /users/login", () => {
    // happy path
    it("should allow you to login & return a successful login message if correct details are provided", async () => {
        const loginDetails = { username: "user1", password: "testing123" };
        const expectedResponse = "[You are now logged in!]";
        const response = await request(app).post("/users/login").send(loginDetails).expect(200);

        expect(response.status).toBe(200);
        //expect(response.text).toBe(expectedResponse); // since we are returning text, use response.text (not response.body)
    });

    // unhappy path
    it("should throw an error & return an error message if incorrect details are provided", async () => {
        const wrongLoginDetails = { username: "user1", password: "wrongpassword" };
        const expectedResponse = "Login failed, wrong password!";
        const response = await request(app).post("/users/login").send(wrongLoginDetails).expect(400);

        expect(response.status).toBe(400);
        expect(response.text).toBe(expectedResponse);
    });

    it("should throw an error since the user profile doesn't exist in DB", async () => {
        const nonExistingLoginDetails = { username: "nonExistingUser", password: "noSuchPassword" };
    
        const response = await request(app).post("/users/login").send(nonExistingLoginDetails).expect(500);

        expect(response.status).toBe(500);
    });

    });
  
    describe("POST /users/logout", () => {
        it("should log you out and return a message", async () => {
            const expectedMessage = "You are now logged out!";
            const response = await request(app).post("/users/logout").expect(200);
            expect(response.status).toBe(200);
            expect(response.text).toBe(expectedMessage)
        });
    });

});