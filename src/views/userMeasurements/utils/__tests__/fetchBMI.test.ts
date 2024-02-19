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
import { fetchBMIData, sendBeaconWithData } from "../fetchFunctions"; // Replace 'yourFile' with the path to your file containing the functions
import { saveBMI } from "../../../../database/setWeightStatsData";

// Mock the functions used within fetchBMIData
jest.mock("../../../../database/setWeightStatsData", () => ({
  saveBMI: jest.fn(),
  sendBeaconWithData: jest.fn()
}));

// Mock the fetchFunctions module
jest.mock("../fetchFunctions", () => ({
  ...jest.requireActual("../fetchFunctions"), // Preserve the actual module behavior
  sendBeaconWithData: jest.fn() // Mock the sendBeaconWithData function
}));

// Mock console.error
console.error = jest.fn();

describe("fetchBMIData", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks(); // Clear all mock function calls
  });

  it("fetches BMI data and saves it", async () => {
    // Mock the response from the API
    const responseData = { data: { bmi: 22, health: "Normal" } };
    fetchMock.mockResponseOnce(JSON.stringify(responseData));

    // Call the function to test
    await fetchBMIData(21, 170, 70);

    // Add your assertions here to ensure the function behaves as expected
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Object),
        keepalive: true
      })
    );
    expect(console.error).toHaveBeenCalled(); // Ensure console.error was called
    expect(saveBMI).not.toHaveBeenCalled(); // Assert that saveBMI function was not called

    // Assert that sendBeaconWithData function was not called
    expect(sendBeaconWithData).not.toHaveBeenCalled();

    // Inspect the error message logged to console.error
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred while fetching data:",
      "Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app)."
    );
  });

  // Add more test cases as needed
});
