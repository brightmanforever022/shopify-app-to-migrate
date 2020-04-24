#!/usr/bin/env ruby
class Api::Frontend::ContactController < Api::Frontend::BaseController
  require 'sendgrid-ruby'
  require 'json'
  include SendGrid

  def sendContactMail
    mailContent = ""
    userName = params[:name]
    userEmail = params[:email]
    mailSubject = params[:subject]
    message = params[:message]

    company = params[:company]
    phone = params[:phone]
    address1 = params[:address_1]
    address2 = params[:address_2]
    city = params[:city]
    country = params[:country]
    zipcode = params[:zip]
    referral = params[:referral]
    attached = params[:attach]

    mailContent += "Contact Name: " + userName + "\n"
    if company.present?
      mailContent += "Company Name: " + company + "\n"
    end
    if phone.present?
      mailContent += "Daytime Telephone: " + phone + "\n"
    end
    mailContent += "Address Line 1: " + address1 + "\n"
    if address2.present?
      mailContent += "Address Line 2: " + address2 + "\n"
    end
    mailContent += "Town/City: " + city + "\nCountry: " + country + "\nPostal Code: " + zipcode + "\nHow they found us: " + referral + "\n"
    mailContent += "-----------------------------------------\n"
    mailContent += message

    from = SendGrid::Email.new(email: userEmail)
    to = SendGrid::Email.new(email: 'info@displays4sale.com')
    # to = SendGrid::Email.new(email: 'yong@halfhelix.com')
    subject = mailSubject
    content = SendGrid::Content.new(type: 'text/plain', value: mailContent)
    mail = SendGrid::Mail.new(from, subject, to, content)

    # Add attachment
    if attached.present?
      attachment = SendGrid::Attachment.new
      attachment.content = Base64.strict_encode64(File.open(attached.tempfile, 'rb').read)
      attachment.type = attached.content_type
      attachment.filename = attached.original_filename
      attachment.disposition = 'attachment'
      mail.add_attachment(attachment)
    end

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    response = sg.client.mail._('send').post(request_body: mail.to_json)
    http_success_response({ error_msg: nil, status: response.status_code, body: response.body })
  end
end