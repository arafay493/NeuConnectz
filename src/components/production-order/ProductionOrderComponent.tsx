'use client';

import { Box } from "@mantine/core"
import TitleComponent from "../common/component-title"
import { IconPlus } from "@tabler/icons-react"
import ProductionOrderTableComponent from "./ProductionOrderTableComponent"
import { useState } from "react"
import { PaginationState } from "@tanstack/react-table"

const ProductionOrderComponent = () => {
    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    return (
        <Box>
            <TitleComponent
                title="Production Order"
                description="Create and manage Production Order for your products."
                buttonText='Add Production Order'
                isButton
                buttonIcon={<IconPlus size={16} />}
            // handleOnClick={openGenerateModal}
            />
            <ProductionOrderTableComponent
                generateBarcodeData={[]}
                pagination={pagination}
                setPagination={setPagination}
                totalCount={10}
            // onSendBarcode={handleSendBarcodeToGenerate}
            />

            {/* <ModalComponent
                onClose={handleCancel}
                onSubmit={handleGenerateBarcodeNext}
                isLoading={false}
                isOpen={generateModalOpened}
                firstButtonColor='#d72b2b'
                secondButtonColor='#2f80ed'
                firstButtonText='Cancel'
                secondButtonText='Next'
            >
                <GenerateBarcodeModalComponent
                    title='Generate Barcode'
                    description='Pease enter quantity to generate barcode'
                    inputLabel='Quantity'
                    inputPlaceholder='Enter quantity'
                    inputValue={quantity}
                    onInputChange={setQuantity}
                />
            </ModalComponent>

            Confirmation Modal
            <ModalComponent
                onClose={handleCancel}
                onSubmit={handleConfirmGeneration}
                isLoading={false}
                isOpen={confirmationModalOpened}
                firstButtonColor='#d72b2b'
                secondButtonColor='#2f80ed'
                firstButtonText='Cancel'
                secondButtonText='Confirm'
            >
                <ConfirmationComponent
                    title='Confirmation'
                    description={`Are you sure you want to generate ${quantity || '0'} barcode${quantity && Number(quantity) > 1 ? 's' : ''}? You will not be able to delete.`}
                />
            </ModalComponent> */}
        </Box>
    )
}

export default ProductionOrderComponent