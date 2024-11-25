import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/HashCode.js";
import { generateAccessToken } from "../utils/GenerateToken.js";
import EmailVerification from "../models/EmailVerification.js";
import nodemailer from "nodemailer"
import { getCode } from "../utils/AuthCode.js";
import { hashToken } from "../utils/HashToken.js";


export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(210).json({ message: "Username và mật khẩu không được để trống." });
        }

        const Check = await User.findOne({ email });
        if (!Check) {
            return res.status(210).json({ message: "Không tìm thấy người dùng." });
        }
        const CheckPassWord = await comparePassword(password, Check.password);
        if (!CheckPassWord) {
            return res.status(210).json({ message: "Mật khẩu không chính xác." });
        }

        const AccessToken = generateAccessToken(Check._id)

        await Check.save();
        return res.status(200).json({ message: "Đăng nhập thành công", AccessToken, Check });

    } catch (error) {
        return res.status(500).json({ message: "Có lỗi ở server, bạn vui lòng đợi giây lát." })
    }
}
export const SignUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!fullName || !email || !password) {
            return res.status(210).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        // Kiểm tra email có được xác thực không
        const authEmail = await EmailVerification.findOne({ emailAddress: email });
        if (!authEmail || !authEmail.isVerified) {
            return res.status(210).json({ message: "Email chưa được xác thực." });
        }

        // Kiểm tra email đã tồn tại trong hệ thống hay chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(210).json({ message: "Email đã được sử dụng." });
        }

        // Hash mật khẩu
        const hashedPassword = await hashPassword(password);

        // Tạo người dùng mới
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            // avatar: {
            //   public_id: myCloud.public_id,
            //   url: myCloud.secure_url,
            // },
        });



        // Trả về thông tin người dùng mới
        return res.status(200).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
        console.error("Error in SignUp:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký." });
    }
};
const sendMailAuthEmail = async (email, code) => {
    try {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        var mailOptions = {
            from: "Simple",
            to: email,
            subject: "Mã xác minh từ trang simple!",
            html: `
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 30px;">
            <div style="text-align: center;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Xác Minh Email</h1>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Mã xác minh của bạn là:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="font-size: 24px; font-weight: bold;">${code}</p>
              </div>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Vui lòng sử dụng mã này để hoàn tất quy trình xác minh.</p>
            </div>
          </div>
        </body>
      `,
        };
        await transporter.sendMail(mailOptions);
        return "success";
    } catch (error) {
        return "error";
    }
};
export const getCodeAuthEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(210).json({ message: "Vui lòng cung cấp email." });
        }

        // Tạo mã xác thực
        const verificationCode = getCode().toString();

        // Tìm kiếm email trong cơ sở dữ liệu
        const existingEmail = await EmailVerification.findOne({ emailAddress: email });

        if (existingEmail) {
            if (existingEmail.isVerified) {
                return res.status(210).json({ message: "Email đã được xác minh." });
            }
            // Cập nhật mã xác thực nếu email chưa được xác minh
            await EmailVerification.findOneAndUpdate(
                { emailAddress: email },
                { verificationCode }
            );
        } else {
            // Tạo bản ghi mới nếu email chưa tồn tại
            await EmailVerification.create({ emailAddress: email, verificationCode });
        }

        // Gửi email xác thực
        const emailSent = await sendMailAuthEmail(email, verificationCode);
        if (!emailSent) {
            return res.status(500).json({ message: "Không thể gửi email xác thực." });
        }

        return res.status(200).json({ message: "Mã xác thực đã được gửi thành công." });
    } catch (error) {
        console.error("Error in getCodeAuthEmail:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi trên máy chủ." });
    }
};
export const authCodeEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Kiểm tra đầu vào
        if (!email || !code) {
            return res.status(400).json({ message: "Vui lòng cung cấp email và mã xác thực." });
        }

        // Tìm kiếm email trong cơ sở dữ liệu
        const emailRecord = await EmailVerification.findOne({ emailAddress: email });
        if (!emailRecord) {
            return res.status(404).json({ message: "Email không tồn tại." });
        }

        // Kiểm tra mã xác thực
        if (code.toString() === emailRecord.verificationCode) {
            // Cập nhật trạng thái email đã xác minh
            await EmailVerification.findOneAndUpdate({ emailAddress: email }, { isVerified: true });
            return res.status(200).json({ message: "Xác thực email thành công." });
        }

        return res.status(400).json({ message: "Mã xác thực không chính xác." });
    } catch (error) {
        console.error("Error in authCodeEmail:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi trên máy chủ." });
    }
};
export const getMyInfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(210).json({ message: "Người dùng không tồn tại!" });
        }
        return res.status(200).json({ message: user });
    } catch (error) {
        return res.status(400).json({ message: "Lỗi từ server, mong bạn đợi giây lát!" });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { fullName, email, avatar } = req.body;

        const userId = req.user._id;
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return res.status(210).json({ message: "Người dùng không tồn tại." });
        }

        // Kiểm tra email mới đã được xác thực chưa (nếu email được thay đổi)
        if (email && email !== user.email) {
            const authEmail = await EmailVerification.findOne({ emailAddress: email });
            if (!authEmail || !authEmail.isVerified) {
                return res.status(210).json({ message: "Email chưa được xác thực." });
            }

            // Kiểm tra email mới đã tồn tại chưa
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== userId) {
                return res.status(210).json({ message: "Email đã được sử dụng." });
            }
        }

        // Cập nhật thông tin người dùng
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;

        // Cập nhật avatar nếu có link mới
        if (avatar) {
            user.avatar = avatar; // Gán trực tiếp link avatar từ req.body
        }

        // Lưu thay đổi
        await user.save();

        // Trả về thông tin người dùng đã cập nhật
        return res.status(200).json({ message: "Cập nhật thông tin thành công!", user });
    } catch (error) {
        console.error("Error in updateUser:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình cập nhật thông tin." });
    }
};
