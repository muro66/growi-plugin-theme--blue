# frozen_string_literal: true

class GanttIssuesController < ApplicationController
  before_action :find_project, :authorize

  def index
    # ビューでガントを描画（データは index で渡す）
    @issues = issues_for_gantt
  end

  def data
    # JSON API: ガント用のタスク一覧
    issues = issues_for_gantt
    tasks = issues.map { |issue| issue_to_task(issue) }
    render json: tasks
  end

  private

  def find_project
    @project = Project.find(params[:project_id])
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def authorize
    deny_access unless User.current.allowed_to?(:view_issues, @project)
  end

  def issues_for_gantt
    # 開始日または期日が設定されているチケットを取得（子プロジェクト含むかは設定次第）
    scope = Issue.visible
                 .where(project_id: @project.id)
                 .where.not(start_date: nil)
                 .where.not(due_date: nil)
    scope = scope.where('start_date <= due_date')
    scope.order(:start_date, :id)
  end

  def issue_to_task(issue)
    {
      id: issue.id.to_s,
      name: issue.subject,
      start: issue.start_date.strftime('%Y-%m-%d'),
      end: issue.due_date.strftime('%Y-%m-%d'),
      progress: issue.done_ratio.to_i,
      custom_class: "issue-priority-#{issue.priority_id}"
    }
  end
end
