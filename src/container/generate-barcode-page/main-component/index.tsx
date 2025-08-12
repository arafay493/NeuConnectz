import TitleComponent from '@/components/common/component-title'
import { Box } from '@mantine/core'
import React from 'react'
import GenerateBarcodeTableComponent from '../table-component'

const GenerateBarcodeComponent = () => {
    return (
        <Box>
            <TitleComponent
                title="Generate Barcode"
                description="Create and manage barcode for your products."
                buttonText='Generate Barcode'
                isButton
            />
            <GenerateBarcodeTableComponent />
        </Box>
    )
}

export default GenerateBarcodeComponent