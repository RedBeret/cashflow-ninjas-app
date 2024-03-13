# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_03_13_005755) do

  create_table "chat_messages", force: :cascade do |t|
    t.integer "user_id", null: false
    t.text "message", null: false
    t.text "response"
    t.datetime "timestamp", null: false
    t.integer "session_id"
  end

  create_table "test_models", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_auth", force: :cascade do |t|
    t.string "username", limit: 255, null: false
    t.string "email", limit: 255, null: false
    t.string "password_hash", limit: 255, null: false
  end

  create_table "user_sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "started_at", null: false
    t.datetime "ended_at"
  end

  add_foreign_key "chat_messages", "user_auth", column: "user_id"
  add_foreign_key "chat_messages", "user_sessions", column: "session_id"
  add_foreign_key "user_sessions", "user_auth", column: "user_id"
end
