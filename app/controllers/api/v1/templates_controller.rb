class Api::V1::TemplatesController < AuthenticatedController
  include Api::V1::ProductsHelper
  before_action :set_template, only: [:show, :edit, :destroy, :update]

  def index
    puts template_index_params.to_json

    currentPage = template_index_params[:currentPage].to_i
    perPage = template_index_params[:perPage].to_i
    offset = (template_index_params[:currentPage].to_i - 1) * perPage

    templates = @shop.templates
      .filtered_templates(template_index_params)
      .offset(offset)
      .limit(perPage)

    totals = @shop.templates
      .filtered_templates(template_index_params)
      .count

    totalPages = (totals.to_f / perPage.to_f).ceil
    hasNext = totalPages > currentPage
    hasPrevious = currentPage > 1

    http_success_response({templates: templates, hasNext: hasNext, hasPrevious: hasPrevious})
  end

  def create
    @template = Template.new(
      label: template_params[:label],
      shop: @shop
    )
    if @template.save
      set_template_variants
      set_template_group_items
      http_success_response({template: @template})
    else
      http_error_response({error: @template.errors.full_messages}, 400)
    end
  end

  def show
    ids = @template.variants.map { |e| "gid://shopify/ProductVariant/#{e.shopify_variant_id}" }
    variants = get_variants_by_ids(ids)
    attributeList = Dattribute.order('id ASC').limit(10)
    render json: {template: @template, variants: variants, attributeList: attributeList }, include: {
      groups: {
        include: {
          drellations: {},
          dattributes: {}
        }
      }
    }
  end

  def edit
  end

  def update
    @template.update({
      label: template_params[:label]
    })

    @template.groups.each do |gr|
      Drellation.where(group_id: gr.id).delete_all
    end
    @template.groups.destroy_all
    @template.variants.destroy_all
    set_template_variants
    set_template_group_items

    ids = @template.variants.map { |e| "gid://shopify/ProductVariant/#{e.shopify_variant_id}" }
    variants = get_variants_by_ids(ids)

    render json: {template: @template, variants: variants }, include: {
      groups: {
        include: {
          drellations: {},
          dattributes: {}
        }
      },
      variants: {}
    }
  end

  def destroy
    if @template.destroy
      http_success_response({})
    else
      http_error_response({message: @template.errors.full_messages}, 400)
    end
  end

  private
    def template_params
      params.except(:id, :controller, :action, :template)
    end

    def set_template
      @template = @shop.templates.find(params[:id])
    end

    def template_index_params
      params.permit(:currentPage, :searchText, :perPage)
    end

    def set_template_variants
      template_params[:variants].each do |variant|
        @variant = Variant.new(
          shopify_variant_id: variant[:id].split('/').last.to_i,
          shopify_product_id: variant[:product][:id].split('/').last.to_i,
          thumbnail: variant[:image] ? variant[:image][:src] : variant[:product][:featuredImage][:transformedSrc],
          label: variant[:displayName],
          price: variant[:price].to_f,
          template: @template
        )
        unless @variant.save
          puts @variant.errors.full_messages
        end
      end
    end

    def set_template_group_items
      template_params[:groups].each do |group|
        @group = Group.new(
          template: @template,
          label: group[:label],
          is_required: group[:is_required],
          display_order: @template.groups.length + 1
        )
        if @group.save
          group[:dattributes].each do |datt|
            @drellation = Drellation.new(
              dattribute_id: datt[:id].to_i,
              group: @group
            )
            unless @drellation.save
              puts @drellation.errors.full_messages
            end
          end
        end
      end
    end

end
