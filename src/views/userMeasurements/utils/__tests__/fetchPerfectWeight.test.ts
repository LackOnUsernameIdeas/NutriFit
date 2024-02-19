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
import { fetchPerfectWeightData, sendBeaconWithData } from "../fetchFunctions"; // Replace 'yourFile' with the path to your file containing the functions
import { savePerfectWeight } from "../../../../database/setWeightStatsData";

// Mock the functions used within fetchPerfectWeightData
jest.mock("../../../../database/setWeightStatsData", () => ({
  savePerfectWeight: jest.fn(),
  sendBeaconWithData: jest.fn()
}));

// Mock the fetchFunctions module
jest.mock("../fetchFunctions", () => ({
  ...jest.requireActual("../fetchFunctions"), // Preserve the actual module behavior
  sendBeaconWithData: jest.fn() // Mock the sendBeaconWithData function
}));

// Mock console.error
console.error = jest.fn();

describe("fetchPerfectWeightData", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks(); // Clear all mock function calls
  });

  it("fetches perfect weight data and saves it", async () => {
    // Mock the response from the API
    const responseData = { data: { Devine: 65 } }; // Example perfect weight data
    fetchMock.mockResponseOnce(JSON.stringify(responseData));

    // Call the function to test
    await fetchPerfectWeightData(170, "male", 70); // Example arguments

    // Add your assertions here to ensure the function behaves as expected
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Object),
        keepalive: true
      })
    );
    expect(console.error).toHaveBeenCalled(); // Ensure no console.error occurred
    expect(savePerfectWeight).not.toHaveBeenCalled(); // Assert that savePerfectWeight function was not called

    // Assert that sendBeaconWithData function was not called
    expect(sendBeaconWithData).not.toHaveBeenCalled();

    // Inspect the error message logged to console.error
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred while fetching data:",
      "Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app)."
    );
  });
});
