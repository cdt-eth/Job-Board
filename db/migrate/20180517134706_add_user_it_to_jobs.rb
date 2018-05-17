class AddUserItToJobs < ActiveRecord::Migration[5.2]
  def change
    add_column :jobs, :user_id, :integer
  end
end
