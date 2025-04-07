import { describe, before, after, it } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert/strict";
import { connectDB } from "../../config/database.js";

describe("API Tests", () => {
  let _server = {}; // Armazena a instância do servidor

  // Função auxiliar para fazer requisições HTTP
  async function makeRequest(url, data, method = "GET") {
    const request = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    return {
      response: request.status === 204 ? null : await request.json(),
      statusCode: request.status,
      statusMessage: request.statusText,
    };
  }
  before(async () => {
    _server = (await import("../../../app.js")).server; // Importa a instância do servidor

    await new Promise((resolve, reject) => {
      _server.once("listening", resolve);
      _server.once("error", reject);
    });

    await connectDB(); // Conecta ao banco de dados
  });

  // GET /api/v1/cars
  it("should GET a list of cars without any data and return 200", async () => {
    const data = await makeRequest("http://localhost:3000/api/v1/cars", null);
    const mockResponse = {
      count: 0,
      pages: 0,
      data: [],
    };
    strictEqual(data.statusCode, 200); // Verifica se o status é 200
    deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
  });

  // POST /api/v1/cars
  it("should CREATE a new car, returning status 201 and the details of the created car", async () => {
    const data = await makeRequest(
      "http://localhost:3000/api/v1/cars",
      {
        brand: "Toyota",
        model: "Corolla",
        plate: "ABC-1D23",
        year: 2018,
      },
      "POST"
    );

    const mockResponse = {
      id: 1,
      brand: "Toyota",
      model: "Corolla",
      plate: "ABC-1D23",
      year: 2018,
      created_at: "",
    };

    strictEqual(data.statusCode, 201); // Verifica se o status é 201
    deepStrictEqual({ ...data.response, created_at: "" }, mockResponse); // Verifica se a resposta é a esperada
  });

  describe("Errors 'POST /api/v1/cars' Suite", () => {
    it("should return a ERROR with status 400 and an 'errors' object with messages 'brand is required', 'model is required', 'year is required', 'plate is required'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars",
        {
          brand: "",
          model: "",
          plate: "",
          year: "",
        },
        "POST"
      );

      const mockResponse = {
        errors: [
          "brand is required",
          "model is required",
          "year is required",
          "plate is required",
        ],
      };

      strictEqual(data.statusCode, 400); // Verifica se o status é 400
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });

    it("should return a ERROR with status 400 and an 'errors' object with messages 'year must be between 2016 and 2026', 'plate must be in the correct format ABC-1C34'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars",
        {
          brand: "Toyota",
          model: "Corolla",
          plate: "xABC-1D23",
          year: 2010,
        },
        "POST"
      );

      const mockResponse = {
        errors: [
          "year must be between 2016 and 2026",
          "plate must be in the correct format ABC-1C34",
        ],
      };

      strictEqual(data.statusCode, 400); // Verifica se o status é 400
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });

    it("should return a ERROR with status 409 and an 'errors' object with message 'car already registered'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars",
        {
          brand: "Fiat",
          model: "Uno",
          plate: "ABC-1D23",
          year: 2022,
        },
        "POST"
      );

      const mockResponse = {
        errors: ["car already registered"],
      };

      strictEqual(data.statusCode, 409); // Verifica se o status é 409
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });
  });

  // GET /api/v1/cars
  it("should GET a list of cars with data and return 200", async () => {
    const data = await makeRequest("http://localhost:3000/api/v1/cars", null);
    const mockResponse = {
      count: 1,
      pages: 1,
      data: [
        {
          id: 1,
          brand: "Toyota",
          model: "Corolla",
          plate: "ABC-1D23",
          year: 2018,
          created_at: "",
        },
      ],
    };

    const response = {
      ...data.response,
      data: data.response.data.map((car) => ({ ...car, created_at: "" })),
    };

    strictEqual(data.statusCode, 200); // Verifica se o status é 200

    deepStrictEqual(response, mockResponse); // Verifica se a resposta é a esperada
  });

  // GET /api/v1/cars/:id
  it("should GET a car by its id, returning 200 and its data without items", async () => {
    const data = await makeRequest("http://localhost:3000/api/v1/cars/1", null);
    const mockResponse = {
      id: 1,
      brand: "Toyota",
      model: "Corolla",
      plate: "ABC-1D23",
      year: 2018,
      created_at: "",
      items: [],
    };
    strictEqual(data.statusCode, 200); // Verifica se o status é 200
    deepStrictEqual({ ...data.response, created_at: "" }, mockResponse); // Verifica se a resposta é a esperada
  });

  describe("Errors 'GET /api/v1/cars/:id' Suite", () => {
    it("should return an ERROR with status 404 and an 'errors' object with message 'car not found'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars/3",
        null
      );

      const mockResponse = {
        errors: ["car not found"],
      };

      strictEqual(data.statusCode, 404); // Verifica se o status é 404
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });
  });

  // PUT /api/v1/cars/:id/items
  it("should UPDATE a car items, returning status 204 and no body", async () => {
    const data = await makeRequest(
      "http://localhost:3000/api/v1/cars/1/items",
      ["Ar condicionado", "Trava Eletrica", "Vidro Eletrico"],
      "PUT"
    );
    strictEqual(data.statusCode, 204); // Verifica se o status é 200
  });

  // GET /api/v1/cars/:id
  it("should GET a car by its id, returning 200 and its data with items", async () => {
    const data = await makeRequest("http://localhost:3000/api/v1/cars/1", null);
    const mockResponse = {
      id: 1,
      brand: "Toyota",
      model: "Corolla",
      plate: "ABC-1D23",
      year: 2018,
      created_at: "",
      items: ["Ar condicionado", "Trava Eletrica", "Vidro Eletrico"],
    };
    strictEqual(data.statusCode, 200); // Verifica se o status é 200
    deepStrictEqual({ ...data.response, created_at: "" }, mockResponse); // Verifica se a resposta é a esperada
  });

  // PATCH /api/v1/cars/:id
  it("should UPDATE a car data, returning status 204 and no body", async () => {
    const data = await makeRequest(
      "http://localhost:3000/api/v1/cars/1/",
      {
        brand: "Fiat",
        model: "Uno",
        plate: "XYZ-1C34",
        year: 2022,
      },
      "PATCH"
    );
    strictEqual(data.statusCode, 204); // Verifica se o status é 204
  });

  describe("Errors 'PATCH /api/v1/cars/:id", () => {
    it("should return an ERROR with status 400 and an 'errors' object with array of messages including 'model must also be informed', 'year must be between 2016 and 2026', 'plate must be in the correct format ABC-1C34'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars/1",
        {
          brand: "Fiat",
          model: "",
          plate: "XYZ1C34",
          year: 2010,
        },
        "PATCH"
      );

      const mockResponse = {
        errors: [
          "model must also be informed",
          "year must be between 2016 and 2026",
          "plate must be in the correct format ABC-1C34",
        ],
      };

      strictEqual(data.statusCode, 400); // Verifica se o status é 409
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });

    it("should return an ERROR with status 409 and an 'errors' object with message 'car already registered'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars/1",
        {
          brand: "Fiat",
          model: "Uno",
          plate: "XYZ-1C34",
          year: 2022,
        },
        "PATCH"
      );

      const mockResponse = {
        errors: ["car already registered"],
      };

      strictEqual(data.statusCode, 409); // Verifica se o status é 409
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });

    it("should return a ERROR with status 404 and an 'errors' object with message 'car not found'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars/3",
        {
          brand: "Fiat",
          model: "Uno",
          plate: "XYZ-1C34",
          year: 2022,
        },
        "PATCH"
      );

      const mockResponse = {
        errors: ["car not found"],
      };

      strictEqual(data.statusCode, 404); // Verifica se o status é 404
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });
  });

  // DELETE /api/v1/cars/:id
  it("should DELETE a car and its items, returning status 204 and no body", async () => {
    const data = await makeRequest(
      "http://localhost:3000/api/v1/cars/1",
      null,
      "DELETE"
    );
    strictEqual(data.statusCode, 204); // Verifica se o status é 200
  });

  describe("Errors 'DELETE /api/v1/cars/:id' Suite", () => {
    it("should return a ERROR with status 404 and an 'errors' object with message 'car not found'", async () => {
      const data = await makeRequest(
        "http://localhost:3000/api/v1/cars/3",
        null,
        "DELETE"
      );

      const mockResponse = {
        errors: ["car not found"],
      };

      strictEqual(data.statusCode, 404); // Verifica se o status é 404
      deepStrictEqual(data.response, mockResponse); // Verifica se a resposta é a esperada
    });
  });

  after((done) => _server.close(done)); // Fecha o servidor após os testes
});
