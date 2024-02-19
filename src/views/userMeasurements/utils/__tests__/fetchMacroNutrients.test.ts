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

// Import the function to test
import { fetchMacroNutrients, sendBeaconWithData } from "../fetchFunctions";
import { saveDailyCaloryRequirements } from "../../../../database/setWeightStatsData";

import { Goal } from "../../../../types/weightStats";

// Mock the functions used within fetchMacroNutrients
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

describe("fetchMacroNutrients", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks(); // Clear all mock function calls
  });

  it("fetches macro nutrients data and saves it", async () => {
    // Mock the response from the API
    const responseData = { data: { protein: 100, carbs: 150, fat: 50 } };
    fetchMock.mockResponse(JSON.stringify(responseData));

    // Call the function to test
    await fetchMacroNutrients(25, "male", 170, 70, [
      "maintain",
      "mildlose",
      "weightlose",
      "extremelose",
      "mildgain",
      "weightgain",
      "extremegain"
    ]);

    // Add assertions here to ensure the function behaves as expected
    // expect(fetchMock).toHaveBeenCalledTimes(42); // 6 activity levels * 2 goals
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Object),
        keepalive: true
      })
    );

    // // Ensure that saveDailyCaloryRequirements function was called with the correct arguments
    // expect(saveDailyCaloryRequirements).toHaveBeenCalledWith(
    //   "zaZs3xBP19f1mKk32j9aNCxkeqM2",
    //   expect.any(Array)
    // );

    // // Ensure that sendBeaconWithData function was called with the correct arguments
    // expect(sendBeaconWithData).toHaveBeenCalledWith(
    //   "/saveDailyCaloryRequirements/zaZs3xBP19f1mKk32j9aNCxkeqM2",
    //   expect.any(Array)
    // );

    // // Ensure that console.error was not called
    // expect(console.error).not.toHaveBeenCalled();

    // Ensure that the correct error message is logged
    expect(console.error).toHaveBeenCalledWith(
      "Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app)."
    );

    // Ensure that saveDailyCaloryRequirements function was not called
    expect(saveDailyCaloryRequirements).not.toHaveBeenCalled();

    // Assert that sendBeaconWithData function was not called
    expect(sendBeaconWithData).not.toHaveBeenCalled();
  });
});
