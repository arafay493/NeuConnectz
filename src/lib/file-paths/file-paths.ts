// Note: This file is used to define the file paths for the application. Like assets file paths...!

import { StaticImageData } from "next/image";
import WhiteLogo from "@/assets/images/white-logo.png";
import BlueLogo from "@/assets/images/blue-logo.png";
import LoginBackGround from "@/assets/images/login-bg.png";
import ProductImage from "@/assets/images/product-image.gif";
import UserIcon from "@/assets/images/user.png"

// Note: Local assets...!
const localAssets: { [key: string]: StaticImageData } = {
    loginBackGround: LoginBackGround,
    whiteLogo: WhiteLogo,
    blueLogo: BlueLogo,
    productImage: ProductImage,
    userIcon: UserIcon
};

export { localAssets };