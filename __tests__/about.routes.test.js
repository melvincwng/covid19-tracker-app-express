const app = require('../src/app');
const request = require('supertest');
const dbHandlers = require("../test/dbHandler");
const About = require('../src/models/about.model');

describe("about routes", () => {

    beforeAll(async () => await dbHandlers.connect());
  
    beforeEach(async () => {
      const aboutData = [
        {
          title: "About Project",
          body: "This project was created as a platform for users to know the latest statistics related to COVID19. It is using created HTML, CSS, JS and MERN Stack."
        },
      ];
      await About.create(aboutData);
    });
  
    afterEach(async () => await dbHandlers.clearDatabase());
  
    afterAll(async () => await dbHandlers.closeDatabase());
  
    describe("GET requests", () => {
      it("GET /about should return information about the project", async () => {
        const expectedData = [
            {
              title: "About Project",
              body: "This project was created as a platform for users to know the latest statistics related to COVID19. It is using created HTML, CSS, JS and MERN Stack."
            },
          ];
          const response = await request(app).get("/about").expect(200)
  
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(expectedData);
      });
    });

});

