import { ReactNode } from "react";

const RootPublicRoutesLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            {children}
        </>
    )
}

export default RootPublicRoutesLayout