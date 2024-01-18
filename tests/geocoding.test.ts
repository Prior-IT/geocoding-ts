import { Geocoding } from "../src";
import { geocodingErrorSchema, placeSchema } from "./types";

describe("Search", () => {
  test("should return results", async () => {
    const response = await Geocoding.search("prior-it");
    expect(response && response[0]).toBeDefined();
  });

  test("should get address if requested", async () => {
    const response = await Geocoding.search("prior-it", { fullAddress: true });
    expect(response && response[0]).toHaveProperty("address");
  });

  test("should not get address if not requested", async () => {
    const response = await Geocoding.search("prior-it");
    expect(response && response[0]).toBeDefined();
    expect(response[0].address).toBeUndefined();
  });

  test("should follow the return type", async () => {
    const response = await Geocoding.search("shop");
    const responseAddress = await Geocoding.search("shop", { fullAddress: true });
    response.forEach((res) => placeSchema.strict().parse(res));
    responseAddress.forEach((res) => placeSchema.strict().parse(res));
  });

  test("should honour the specified limit", async () => {
    const responseAll = await Geocoding.search("shop");
    const responseLimited = await Geocoding.search("shop", { limit: 1 });
    expect(responseAll && responseAll.length).toBeGreaterThan(1);
    expect(responseLimited && responseLimited.length).toBe(1);
  });
});

describe("Reverse", () => {
  test("should return results", async () => {
    const response = await Geocoding.reverse(51.0195611619683, 3.68261385663317);
    expect(response).toBeDefined();
  });

  test("should always get address", async () => {
    const response = await Geocoding.reverse(51.0195611619683, 3.68261385663317);
    expect(response).toHaveProperty("address");
  });

  test("should follow the return type", async () => {
    const response = await Geocoding.reverse(51.0195611619683, 3.68261385663317);
    placeSchema.strict().parse(response);
  });

  test("should always return a valid result", async () => {
    for (let i = 0; i < 5; i++) {
      const response = await Geocoding.reverse(Math.random() * 180 - 90, Math.random() * 360 - 180);
      expect(response).toBeDefined();
      if (response.is_error) {
        geocodingErrorSchema.strict().parse(response);
      } else {
        placeSchema.strict().parse(response);
      }
    }
  }, 10000); // increase timeout to 10s
});
