class Api::Frontend::ContactController < Api::Frontend::BaseController
  require 'sendgrid-ruby'
  require 'json'
  include SendGrid

  def sendContactMail
    userName = params[:user_name]
    userEmail = params[:user_email]
    mailSubject = params[:mail_title]
    mailContent = params[:mail_content]
    # puts "mail content is: #{mailContent}"

    from = SendGrid::Email.new(email: userEmail)
    to = SendGrid::Email.new(email: 'yong@halfhelix.com')
    subject = mailSubject
    content = SendGrid::Content.new(type: 'text/plain', value: mailContent)
    mail = SendGrid::Mail.new(from, subject, to, content)

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    response = sg.client.mail._('send').post(request_body: mail.to_json)
    puts "---response is: #{response.body}"
    http_success_response({ status: response.status_code, body: response.body, parsed_body: response.parsed_body, headers: response.headers })
  end
end