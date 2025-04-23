// Note: This file is used to define the file paths for the application. Like assets file paths...!

import { StaticImageData } from "next/image";
import WhiteLogo from "@/assets/images/logo.png";
import LoginBackGround from "@/assets/images/login-bg.png";
import ProductImage from "@/assets/images/product-image.gif";

// Note: Local assets...!
const localAssets: { [key: string]: StaticImageData } = {
    loginBackGround: LoginBackGround,
    whiteLogo: WhiteLogo,
    productImage: ProductImage,
};

export { localAssets };