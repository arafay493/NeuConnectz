import HtmlAppLayout from "@/components/app-layout/html-app-layout";
import { ReactNode } from "react";

const RootAuthenticatedRoutesLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <HtmlAppLayout>
            {children}
        </HtmlAppLayout>
    )
}

export default RootAuthenticatedRoutesLayout