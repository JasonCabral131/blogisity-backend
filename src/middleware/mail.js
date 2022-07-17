const  nodemailer = require("nodemailer");

exports.Mailing = (option) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:  process.env.mail_address,
          pass:process.env.mail_password ,
        },
      });

      return new Promise((resolve, reject) => {
        var mailOptions = {
            from: "7.11.grocery.info@gmail.com",
            to: `${option.receiver}`,
            subject: `${option.subject}`,
            attachDataUrls: true,
            html: `
            <div marginwidth="0" marginheight="0">
    
            <table border="0" width="100%" cellpadding="" cellspacing="" bgcolor="#f3f3f3">
                <tbody><tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="40" cellspacing="0" style="background:linear-gradient(296deg,#7b2d8f,#3f17d3)">
                            <tbody>
                                <tr>
                                <td align="center">
                                 <h3 style="color: #fff; text-align: center; font-size: 3rem; font-weight: 800">Blogisity</h3>
                                </td>
                            </tr>
                           
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            
            
            <table border="0" width="100%" cellpadding="" cellspacing="" bgcolor="#f3f3f3" style="margin-top:0rem;font-family:'Work Sans',Calibri,sans-serif">
                <tbody><tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" style="background-color:#ffffff">
                            <tbody>   
                            <tr>
                                <td align="center">
                                    <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" style="height: auto; padding: 20px">
                                        <tbody><tr>
                                            <td align="left" style="color:#888888;font-size:16px;font-family:'Work Sans',Calibri,sans-serif;">
                                                <div style="width: 100%">
                                                    ${option.content}   
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                          
                                        </tr>
                                    </tbody></table>
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" style="margin-top:2rem;background:rgba(143,63,158,0.20)">
                            <tbody><tr>
                                <td align="center">
                                    <table border="0" width="450" align="center" cellpadding="30" cellspacing="0">
                                        <tbody>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
               
                </tbody>
                </table>
            <div class="yj6qo">
            </div>
            <div class="adL">
            </div>
            </div>

            
                `
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("Email Error sent: " + error);
              resolve(false);
            } else {
              console.log("Email Success sent: " + info?.response);
              resolve(true);
            }
          });
      })
}