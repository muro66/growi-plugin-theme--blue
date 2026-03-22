# Redmine plugin routes
Rails.application.routes.draw do
  get 'projects/:project_id/gantt_issues', to: 'gantt_issues#index', as: 'project_gantt_issues'
  get 'projects/:project_id/gantt_issues/data', to: 'gantt_issues#data', as: 'project_gantt_issues_data'
end
