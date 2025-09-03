'use client';

import { Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import TitleComponent from "../common/component-title";
import { useRouter } from "next/navigation";

const HandlingUnitComponent = () => {
    // Note: Router for route changing
    const router = useRouter();

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    const handlingRouteChange = () => {
        router.push('/handling-unit/add-unit');
    }

    return (
        <Box>
            <TitleComponent
                title="Handling Unit"
                description="Create and manage Handling Unit for your products."
                buttonText='Add Handling Unit'
                isButton
                buttonIcon={<IconPlus size={16} />}
                handleOnClick={handlingRouteChange}
            />
        </Box>
    )
}

export default HandlingUnitComponent