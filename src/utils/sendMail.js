const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    return sgMail
    .send({
        to: email,
        from: 'samipan.b@antino.io',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app,${name}  Let me know how you get along with the app.`
    })
    .then(() => {
        // console.log('Email sent')
        return true;
    })
    .catch((error) => {
        return false;
      })
}

const sendurl = (email,url) => {
    const msg = {
        to: email,
        from: 'samipan.b@antino.io',
        subject: 'Your excel file url',
        text: "your url is ",
        html:`You url is <a href=${url}>click here to download</a>`
    }
    return sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
        return true;
    })
    .catch((error) => {
        console.log(error);
        return false;
      })
}


module.exports = {
    sendWelcomeEmail,sendurl
}