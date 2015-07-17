Rails.application.routes.draw do
  # index is the root of the application
  root 'locator#index'
  # would have been used for navigating to a different page, but manipulating DOM elements is more clever
  get '/locator' => 'locator#show'
  # created to send chase API data to solve cross-domain ajax request issue
  get '/chaseparty' => 'locator#chaseparty'
  # get '/index' => 'locator#index'

end
