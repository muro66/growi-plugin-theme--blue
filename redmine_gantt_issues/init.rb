# Redmine plugin: Gantt chart for Issues (チケットガントチャート)
# Copyright (C) 2025
# This program is free software; you can redistribute it and/or modify it under the terms of the MIT License.

require 'redmine'

Redmine::Plugin.register :redmine_gantt_issues do
  name 'Redmine Gantt Issues'
  author 'Plugin Author'
  description 'プロジェクトのチケット（開始日・期日あり）をガントチャートで表示するプラグイン'
  version '1.0.0'
  url ''
  author_url ''

  menu :project_menu, :gantt_issues,
       { controller: 'gantt_issues', action: 'index' },
       caption: :label_gantt_chart,
       after: :issues,
       param: :project_id
end

# 多言語ラベル
Rails.application.config.after_initialize do
  Redmine::MenuManager::MenuItem.define(:label_gantt_chart) do
    I18n.t(:label_gantt_chart, default: 'ガントチャート')
  end
end
