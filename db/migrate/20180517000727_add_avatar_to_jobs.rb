class AddAvatarToJobs < ActiveRecord::Migration[5.2]
  def change
    add_column :jobs, :avatar, :string
  end
end
