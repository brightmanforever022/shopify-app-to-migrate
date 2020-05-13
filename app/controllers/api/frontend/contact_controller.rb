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
    state = params[:state]
    country = params[:country]
    zipcode = params[:zip]
    referral = params[:referral]
    attached = params[:attach]

    mailContent += "<b>Contact Name</b>: " + userName + "<br>"
    if company.present?
      mailContent += "<b>Company Name</b>: " + company + "<br>"
    end
    if phone.present?
      mailContent += "<b>Daytime Telephone</b>: " + phone + "<br>"
    end
    mailContent += "<b>Address Line 1</b>: " + address1 + "<br>"
    if address2.present?
      mailContent += "<b>Address Line 2</b>: " + address2 + "<br>"
    end
    mailContent += "<b>Town/City</b>: " + city + "<br><b>Province/State</b>: " + state + "<br><b>Country</b>: " + country + "<br><b>Postal Code</b>: " + zipcode + "<br><b>How they found us</b>: " + referral + "<br>"
    mailContent += "__________________________________________<br><br>"
    mailContent += message

    from = SendGrid::Email.new(email: userEmail)
    to = SendGrid::Email.new(email: ENV['CONTACT_EMAIL'])
    # to = SendGrid::Email.new(email: 'yong@halfhelix.com')
    subject = mailSubject
    content = SendGrid::Content.new(type: 'text/html', value: mailContent)
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