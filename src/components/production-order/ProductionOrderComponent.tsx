'use client';

import { Box } from "@mantine/core"
import TitleComponent from "../common/component-title"
import { IconPlus } from "@tabler/icons-react"
import ProductionOrderTableComponent from "./ProductionOrderTableComponent"
import { useEffect, useState } from "react"
import { PaginationState } from "@tanstack/react-table"
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { listProductionOrder } from "@/redux/actions/production-order-actions/production-order-actions";

const ProductionOrderComponent = () => {
    const { data, totalCount } = useAppSelector(({ productionOrderStates }) => productionOrderStates);

    console.log("ProductionOrderComponent -> data, totalCount", data, totalCount);

    // Note: Router for route changing
    const router = useRouter();

    const dispatch = useAppDispatch();

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    const handlingRouteChange = () => {
        router.push('/production-order/add-order');
    }

    const handleScanProductionOrder = (id: string) => {
        router.push(`/production-order/scan/${id}`);
    }

    useEffect(() => {
        dispatch(listProductionOrder({ lastCount: pagination.pageSize, skipRecords: pagination.pageIndex * pagination.pageSize }));
    }, [dispatch, pagination.pageSize, pagination.pageIndex]);

    return (
        <Box>
            <TitleComponent
                title="Production Order"
                description="Create and manage Production Order for your products."
                buttonText='Add Production Order'
                isButton
                buttonIcon={<IconPlus size={16} />}
                handleOnClick={handlingRouteChange}
            />
            <ProductionOrderTableComponent
                productionOrderList={data}
                pagination={pagination}
                setPagination={setPagination}
                totalCount={totalCount}
                onSendBarcode={handleScanProductionOrder}
            />
        </Box>
    )
}

export default ProductionOrderComponent