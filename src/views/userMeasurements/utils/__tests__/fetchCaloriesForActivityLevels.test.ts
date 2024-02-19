// Import fetchMock and enable it
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

// Mock Firebase and initializeApp
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: "zaZs3xBP19f1mKk32j9aNCxkeqM2" // Mock user ID
    }
  }))
}));

// Import the functions to test
import {
  fetchCaloriesForActivityLevels,
  sendBeaconWithData
} from "../fetchFunctions"; // Replace 'yourFile' with the path to your file containing the functions
import { saveDailyCaloryRequirements } from "../../../../database/setWeightStatsData";

// Mock the functions used within fetchCaloriesForActivityLevels
jest.mock("../../../../database/setWeightStatsData", () => ({
  saveDailyCaloryRequirements: jest.fn(),
  sendBeaconWithData: jest.fn()
}));

// Mock the fetchFunctions module
jest.mock("../fetchFunctions", () => ({
  ...jest.requireActual("../fetchFunctions"), // Preserve the actual module behavior
  sendBeaconWithData: jest.fn() // Mock the sendBeaconWithData function
}));

// Mock console.error
console.error = jest.fn();

describe("fetchCaloriesForActivityLevels", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks(); // Clear all mock function calls
  });

  it("fetches perfect weight data and logs the correct error message", async () => {
    // Mock the response from the API
    const responseData = { data: { Devine: 65 } }; // Example perfect weight data
    fetchMock.mockResponseOnce(JSON.stringify(responseData));

    // Call the function to test
    await fetchCaloriesForActivityLevels(25, "male", 170, 70); // Example arguments

    // Add your assertions here to ensure the function behaves as expected
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Object),
        keepalive: true
      })
    );

    // Ensure that the correct error message is logged
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred while fetching data:",
      "invalid json response body at  reason: Unexpected end of JSON input",
      "Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app)."
    );

    // Ensure that saveDailyCaloryRequirements function was not called
    expect(saveDailyCaloryRequirements).not.toHaveBeenCalled();

    // Assert that sendBeaconWithData function was not called
    expect(sendBeaconWithData).not.toHaveBeenCalled();
  });
});
