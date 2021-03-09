const app = require('../src/app');
const request = require('supertest');
const dbHandlers = require("../test/dbHandler");
const Article = require('../src/models/article.model');

describe("article routes", () => {
    beforeAll(async () => await dbHandlers.connect());
  
    beforeEach(async () => {
      const articleData = [
        {
          title: "Article 1",
          body: "This is the very first article of the COVID19 articles section.",
        },
        {
          title: "Article 2",
          body: "This is the second article of the COVID19 articles section.",
        }
      ];
      await Article.create(articleData);
    });
  
    afterEach(async () => await dbHandlers.clearDatabase());
  
    afterAll(async () => await dbHandlers.closeDatabase());
  
    describe("get /articles", () => {
      it("should return an array of articles", async () => {
        const expectedData = [
            {
              title: "Article 1",
              body: "This is the very first article of the COVID19 articles section.",
            },
            {
              title: "Article 2",
              body: "This is the second article of the COVID19 articles section.",
            }
          ];
          const response = await request(app).get("/articles").expect(200)
  
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(expectedData);
      });
    });

  
});

