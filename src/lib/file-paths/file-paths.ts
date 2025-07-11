// Note: This file is used to define the file paths for the application. Like assets file paths...!

import { StaticImageData } from "next/image";
import LoginBackGround from "@/assets/images/login-bg.png";
import ProductImage from "@/assets/images/product-image.gif";
import UserIcon from "@/assets/images/user.png";
import NewLogo from "@/assets/images/new-logo.svg";
import WhiteLogo from "@/assets/images/white-logo.svg";
import ReconciliationNotFoundImage from "@/assets/images/reconciliation-not-found.svg";

// Note: Local assets...!
const localAssets: { [key: string]: StaticImageData } = {
    loginBackGround: LoginBackGround,
    newLogo: NewLogo,
    productImage: ProductImage,
    userIcon: UserIcon,
    whiteLogo: WhiteLogo,
    reconciliationNotFoundImage: ReconciliationNotFoundImage,
};

export { localAssets };