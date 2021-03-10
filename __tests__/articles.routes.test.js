const app = require('../src/app');
const request = require('supertest');
const dbHandlers = require("../test/dbHandler");
const Article = require('../src/models/article.model');
const User = require('../src/models/user.model');
const createJWTToken = require("../src/config/jwt");

describe("article routes", () => {
    let token;

    beforeAll(async () => await dbHandlers.connect());
  
    beforeEach(async () => {
      const articleData = [
        {
          title: "Article 1",
          body: "This is the very first article of the COVID19 articles section.",
          authorName: "Author 1"
        },
        {
          title: "Article 2",
          body: "This is the second article of the COVID19 articles section.",
          authorName: "Author 2"
        }
      ];
      await Article.create(articleData);

      const user = new User({username:"testing123", password:"testing123"});
      await user.save();

      token = createJWTToken(user.username);
    });
  
    afterEach(async () => await dbHandlers.clearDatabase());
  
    afterAll(async () => await dbHandlers.closeDatabase());
  
    describe("GET requests", () => {
      it("GET /articles should return an array of articles", async () => {
        const expectedData = [
            {
              title: "Article 1",
              body: "This is the very first article of the COVID19 articles section.",
              authorName: "Author 1",      
            },
            {
              title: "Article 2",
              body: "This is the second article of the COVID19 articles section.",
              authorName: "Author 2",
            }
          ];
          const response = await request(app).get("/articles").expect(200)
  
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(expectedData);
      });

      it("GET /articles/:id should return an article with the correct id", async () => {
            const expectedArticle = 
                {
                title: "Article 1",
                body: "This is the very first article of the COVID19 articles section.",
                authorName: "Author 1"
                };
            const article = await Article.findOne({ title: "Article 1" });
            const response = await request(app).get(`/articles/${article._id}`).expect(200)
  
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(expectedArticle);
      });
    });

    describe("POST requests", () => {
        it("POST /articles should allow you to post an article if logged in; and then return it", async () => {
            const article = { title: "New Article", body: "This is a new article!", authorName: "Author 1" }; 
            const response = await request(app).post("/articles").send(article).set("Cookie", `token=${token}`).expect(201)
    
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(article);
        });

        it("POST articles/ should not allow you to post an article if not logged in", async () => {
            const article = { title: "New Article", body: "This is a new article!", authorName: "Author 1" }; 
            const response = await request(app).post("/articles").send(article).expect(401)
    
            expect(response.status).toBe(401);
            expect(response.text).toBe("You are not authorized");
        });

    });

    describe("PUT requests", () => {
    it("PUT articles/:id should edit the selected article successfully if logged in and given valid id", async () => {
            const article = await Article.findOne({ title: "Article 1"});
            const newArticle = { title: "New Article Title", body: "New Text in Body", authorName: "Author 1" };
        
            const response = await request(app)
            .put(`/articles/${article._id}`)
            .send(newArticle) //updating the article
            .set("Cookie", `token=${token}`)
            .expect(200)

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('New Article Title');
            expect(response.body).toMatchObject(newArticle);
        });

        it("PUT articles/:id should not edit the selected article even if valid article id AS NOT LOGGED IN", async () => {
            const article = await Article.findOne({ title: "Article 1"});
            const newArticle = { title: "New Article Title", body: "New Text in Body", authorName: "Author 1" };
        
            const response = await request(app)
            .put(`/articles/${article._id}`)
            .send(newArticle) //updating the article
            .expect(401)

            expect(response.status).toBe(401);
            expect(response.text).toBe('You are not authorized');
        });

        it("PUT articles/:id should throw an error even if article doesn't exist at all", async () => {
            const nonExistingArticleId = 'nonExistingId123add123'
            const newArticle = { title: "New Article Title", body: "New Text in Body", authorName: "Author 1" };
        
            const response = await request(app)
            .put(`/articles/${nonExistingArticleId}`)
            .send(newArticle)
            .set("Cookie", `token=${token}`)
            .expect(500)

            expect(response.status).toBe(500);
        });
    
    });

    describe("DELETE requests", () => {
        it("DELETE articles/:id should delete the selected article successfully if logged in and given valid id", async () => {
                const article = await Article.findOne({ title: "Article 1"});
                const deletedArticle = {
                    title: "Article 1",
                    body: "This is the very first article of the COVID19 articles section.",
                    authorName: "Author 1"
                };
            
                const response = await request(app)
                .delete(`/articles/${article._id}`)
                .set("Cookie", `token=${token}`)
                .expect(200)
    
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(deletedArticle);
        });
    
        it("DELETE articles/:id should not delete the selected article even if valid article id AS NOT LOGGED IN", async () => {
            const article = await Article.findOne({ title: "Article 1"});
           
            const response = await request(app)
            .delete(`/articles/${article._id}`)
            .expect(401)

            expect(response.status).toBe(401);
            expect(response.text).toBe('You are not authorized');
        });
    
        it("DELETE articles/:id should throw an error even if article doesn't exist at all", async () => {
            const nonExistingArticleId = 'nonExistingId123add123'
        
            const response = await request(app)
            .delete(`/articles/${nonExistingArticleId}`)
            .set("Cookie", `token=${token}`)
            .expect(500)

            expect(response.status).toBe(500);
        });
        
    });
  
});

