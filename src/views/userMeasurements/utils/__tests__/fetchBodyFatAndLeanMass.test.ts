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
  fetchBodyFatAndLeanMassData,
  sendBeaconWithData
} from "../fetchFunctions"; // Replace 'yourFile' with the path to your file containing the functions
import { saveBodyMass } from "../../../../database/setWeightStatsData";

// Mock the functions used within fetchBodyFatAndLeanMassData
jest.mock("../../../../database/setWeightStatsData", () => ({
  saveBodyMass: jest.fn(),
  sendBeaconWithData: jest.fn()
}));

// Mock the fetchFunctions module
jest.mock("../fetchFunctions", () => ({
  ...jest.requireActual("../fetchFunctions"), // Preserve the actual module behavior
  sendBeaconWithData: jest.fn() // Mock the sendBeaconWithData function
}));

// Mock console.error
console.error = jest.fn();

describe("fetchBodyFatAndLeanMassData", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks(); // Clear all mock function calls
  });

  it("fetches body fat and lean mass data and does not save it", async () => {
    // Mock the response from the API
    const responseData = {
      data: {
        "Body Fat (U.S. Navy Method)": 20,
        "Body Fat Mass": 15,
        "Lean Body Mass": 65
      }
    };
    fetchMock.mockResponseOnce(JSON.stringify(responseData));

    // Call the function to test
    await fetchBodyFatAndLeanMassData(25, "male", 170, 70, 30, 80, 90);

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
    expect(saveBodyMass).not.toHaveBeenCalled(); // Assert that saveBodyMass function was not called

    // Assert that sendBeaconWithData function was not called
    expect(sendBeaconWithData).not.toHaveBeenCalled();

    // Inspect the error message logged to console.error
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred while fetching data:",
      "Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app)."
    );
  });
});
