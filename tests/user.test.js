import "dotenv/config";
import request from "supertest";
import app from "../app.js";
import DbConnection from "../DB/models/connection.js";

describe("Users API", () => {

    test("POST / Users should return 400 if email already exists ",async () => {
       const email = `hazem ${Date.now()}@test.com`;
       
       const firstResponse = await request(app)
       .post("/users")
       .send({
        name : "hazem",
        email:email ,
        password :"123456"
       });
     expect(firstResponse.status).toBe(201);

     const secondResponse = await request(app)
        .post("/users")
        .send({
            name: "Hazem",
            email: email,
            password: "123456"
        });

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body).toHaveProperty(
        "error",
        "Email already exists"
    );
    });

    test("GET /users should return all users", async () => {
        const response = await request(app).get("/users")
       expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("email");
     
    });
    test("PUT /users/:id should update user details", async () => {
        // Create a new user to update
        const createResponse = await request(app)
            .post("/users")
            .send({
                name: "Test User",
                email: `testuser${Date.now()}@test.com`,
                password: "123456"
            });
        expect(createResponse.status).toBe(201);
        const userId = createResponse.body.userId;
        
        // Update the user's details
        const updateResponse = await request(app)
            .put(`/users/${userId}`)
            .send({
                name: "Updated User",
                email: `updateduser${Date.now()}@test.com`,
                password: "654321"
            });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toHaveProperty("message", "User updated");

});
 
  
  test("PUT /users/:id should return 404 if user not found", async () => {
    const nonExistentUserId = -1; // Assuming this ID does not exist in the database

    const response = await request(app)
        .put(`/users/${nonExistentUserId}`)
        .send({
            name: "Non-existent User",
            email: `nonexistentuser${Date.now()}@test.com`,
            password: "123456"
        });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });  
  test("PUT /users/:id should return 400 if request fields are missing ", async () => {
    const response = await request(app)
        .put("/users/1")
        .send({
            name: "Test User",
        });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
        "error",
        "Name, email, and password are required"
    );
  });
  afterAll (async()=>{
    await DbConnection.end();
  });
})
