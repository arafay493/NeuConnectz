// Note: This file is used to define the file paths for the application. Like assets file paths...!

import { StaticImageData } from "next/image";
// import LoginBackGround from "@/assets/images/login-bg.png";
// import ProductImage from "@/assets/images/product-image.gif";
// import UserIcon from "@/assets/images/user.png";
import NewLogo from "@/assets/images/new-logo.svg";
import WhiteLogo from "@/assets/images/white-logo.svg";
import ReconciliationNotFoundImage from "@/assets/images/reconciliation-not-found.svg";
import ConfigAccessLogo from "@/assets/images/configuration-logo.svg";
// import Logo_sm from "@/assets/images/Logo_sm.png";
import DataNotFound from "@/assets/images/Data_Not_Found.svg";
// import QBSLogo from "@/assets/images/QBS _LOGO.svg";
import PoweredQBS from "@/assets/images/PoweredByQBS.svg";

// Note: Local assets...!
const localAssets: { [key: string]: StaticImageData } = {
    // loginBackGround: LoginBackGround,
    newLogo: NewLogo,
    // productImage: ProductImage,
    // userIcon: UserIcon,
    whiteLogo: WhiteLogo,
    // logo_sm: Logo_sm,
    // logo_sm_new: Logo_sm,
    reconciliationNotFoundImage: ReconciliationNotFoundImage,
    configAccessLogo: ConfigAccessLogo,
    dataNotFound: DataNotFound,
    // qbsLogo: QBSLogo,
    poweredQBS: PoweredQBS
};

export { localAssets };