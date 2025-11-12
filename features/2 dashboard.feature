Feature: Dashboard and Logout Functionality
  As a logged in user
  I want to logout from the application
  So that I can securely end my session

  Scenario: Successful logout from dashboard
    Given I am logged in to the application
    When I click on the profile icon
    And I click on the logout button
    Then I should be redirected to the login page