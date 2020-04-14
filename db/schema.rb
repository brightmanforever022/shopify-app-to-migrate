# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_14_144232) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "dattributes", force: :cascade do |t|
    t.string "label", null: false
    t.float "price"
    t.boolean "price_type"
    t.float "weight"
    t.float "width"
    t.float "length"
    t.float "girth"
    t.string "attribute_code"
    t.string "postal_code", default: ""
    t.string "store_list", default: "display4sale"
    t.string "vendor_sku", default: ""
    t.float "width2", default: 0.0
    t.float "length2", default: 0.0
    t.float "girth2", default: 0.0
    t.float "width3", default: 0.0
    t.float "length3", default: 0.0
    t.float "girth3", default: 0.0
    t.float "weight2", default: 0.0
    t.float "weight3", default: 0.0
    t.boolean "freight", default: false
    t.integer "min_ship_quantity", default: 0
    t.integer "max_ship_quantity", default: 0
    t.float "ship_price_percent", default: 0.0
  end

  create_table "drellations", force: :cascade do |t|
    t.bigint "group_id"
    t.bigint "dattribute_id"
    t.string "excepts", default: ""
    t.string "table_row_option", default: "0"
    t.string "table_row_vendor", default: "0"
    t.index ["dattribute_id"], name: "index_drellations_on_dattribute_id"
    t.index ["group_id"], name: "index_drellations_on_group_id"
  end

  create_table "freightoptions", force: :cascade do |t|
    t.string "label"
    t.float "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "shop_id"
    t.string "description"
    t.index ["shop_id"], name: "index_freightoptions_on_shop_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "label"
    t.integer "group_type"
    t.boolean "is_required", default: true
    t.integer "display_order", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "template_id"
    t.index ["template_id"], name: "index_groups_on_template_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "label"
    t.bigint "shopify_variant_id"
    t.float "price"
    t.integer "quantity"
    t.integer "display_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "group_id"
    t.string "shopify_variant_title"
    t.index ["group_id"], name: "index_items_on_group_id"
  end

  create_table "quotes", force: :cascade do |t|
    t.string "dorder_id"
    t.string "dorder_name"
    t.string "dorder_invoice_url"
    t.string "uploaded_file_url"
    t.string "uploaded_file_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "shop_id"
    t.index ["shop_id"], name: "index_quotes_on_shop_id"
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.string "api_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shopify_domain"], name: "index_shops_on_shopify_domain", unique: true
  end

  create_table "templates", force: :cascade do |t|
    t.string "label", null: false
    t.string "thumbnail"
    t.string "product_type"
    t.bigint "shopify_product_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "shop_id"
    t.string "product_id", default: ""
    t.index ["shop_id"], name: "index_templates_on_shop_id"
  end

  create_table "variants", force: :cascade do |t|
    t.bigint "shopify_variant_id", null: false
    t.bigint "shopify_product_id", null: false
    t.string "thumbnail"
    t.string "label"
    t.float "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "template_id"
    t.index ["template_id"], name: "index_variants_on_template_id"
  end

  add_foreign_key "freightoptions", "shops"
  add_foreign_key "groups", "templates"
  add_foreign_key "items", "groups"
  add_foreign_key "quotes", "shops"
  add_foreign_key "templates", "shops"
  add_foreign_key "variants", "templates"
end
