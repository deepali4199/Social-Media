const nodemailer = require("nodemailer");

const sendmail = async (res, email , User ) => {
    try {

        const url = `https://social-media-w3lr.onrender.com/forget-password/${User._id}`;
        
const transport = nodemailer.createTransport({
    service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "shivangpuri995@gmail.com",
                pass: "tnpzqjzpyyduerfs",
    },
  });
  const mailOptions = {
    from: "Shivang Social Media Private Ltd. <shivangsocial@media.pvt.ltd>",
    to: email,
    subject: "Password Reset Link",
    text: "Do not share this link to anyone",
    html: `<a href="${url}">Reset Password Link</a>`,
};
  transport.sendMail(mailOptions, async (err, info) => {
    if (err) return res.send(err);
    console.log(info);

    User.resetPasswordToken = 1;
    await User.save();

    res.send(
        `<h1 class="text-5xl text-center mt-5 bg-red-300">Check your inbox/spam.</h1>`
    );
});
    } catch (error) {
        res.send(error);
        
    }
}

module.exports = sendmail;