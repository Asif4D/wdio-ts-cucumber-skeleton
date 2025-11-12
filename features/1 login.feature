Feature: Login Functionality
  As a user
  I want to login to the application
  So that I can access the dashboard
    
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter email "testadmin@coastcapitalsavings.com" and password "Test12345!"
    And I click on the login button
    Then I should be redirected to the dashboard