Rails.application.routes.draw do
get "/peppers" => redirect("/")
get "/users" => redirect("/")
  devise_for :users
  resources :users
  resources :peppers do
    resources :tasks
  end
  resources :main

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'main#index'
end
