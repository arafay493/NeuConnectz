'use client';

import TitleComponent from '@/components/common/component-title';
import GenerateBarcodeModalComponent from '@/components/generate-barcode/GenerateBarcodeModalComponent';
import ConfirmationComponent from '@/components/message-modal/MessageModalComponent';
import ModalComponent from '@/components/modal-component/ModalComponent';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { addGenerateBarcode, fetchGeneratedBarcodeData, sendGenerateBarcodeToEmail } from '@/redux/actions/generate-barcode-actions/generate-barcode-actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { PaginationState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import GeneratedBarcodeTableComponent from './GeneratedBarcodeTableComponent';
import LoaderComponent from '../common/loader/loader';

const GenerateBarcodeComponent = () => {
    const [generateModalOpened, { open: openGenerateModal, close: closeGenerateModal }] = useDisclosure(false);
    const [confirmationModalOpened, { open: openConfirmationModal, close: closeConfirmationModal }] = useDisclosure(false);
    const [quantity, setQuantity] = useState('');
    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Initialize dispatch
    const dispatch = useAppDispatch();

    const handleGenerateBarcodeNext = () => {
        // Close the generate modal and open confirmation modal
        closeGenerateModal();
        openConfirmationModal();
    };

    const { generateBarcodeData, totalCount, loading } = useAppSelector(({ generateBarcodeStates }) => { return generateBarcodeStates; })

    const responseHandler = (status: number) => {
        if (status === 201) {
            closeConfirmationModal();
            // Reset quantity
            setQuantity('');

            showNotificationToast("Barcode Generated", "Barcode generated successfully", customStyles.colors._408CCE);
            dispatch(fetchGeneratedBarcodeData({ lastCount: pagination.pageSize, skipRecords: pagination.pageIndex * pagination.pageSize }));
            return;
        }

        if (status === 500) {
            showNotificationToast("Server Error", "An error occurred on the server", customStyles.colors.red);
            return;
        }
    }

    const handleConfirmGeneration = () => {
        // Close confirmation modal
        closeConfirmationModal();
        // Reset quantity
        dispatch(addGenerateBarcode({ qty: Number(quantity), resHandler: responseHandler }))
        // You can add your barcode generation API call here
    };

    const handleCancel = () => {
        // Close any open modal and reset state
        closeGenerateModal();
        closeConfirmationModal();
        setQuantity('');
    };

    const handleSendBarcodeToGenerate = (id: string, email?: string) => {
        // dispatch(sendGenerateBarcodeToEmail({ id, email, resHandler: responseHandler }))
    }

    useEffect(() => {
        dispatch(fetchGeneratedBarcodeData({ lastCount: pagination.pageSize, skipRecords: pagination.pageIndex * pagination.pageSize }));
    }, [pagination.pageIndex, pagination.pageSize, dispatch])

    return (
        <Box style={{ position: 'relative' }}>
            <TitleComponent
                title="Generate Barcode"
                description="Create and manage barcode for your products."
                buttonText='Generate Barcode'
                isButton
                buttonIcon={<IconPlus size={16} />}
                handleOnClick={openGenerateModal}
            />
            <GeneratedBarcodeTableComponent
                generateBarcodeData={generateBarcodeData}
                pagination={pagination}
                setPagination={setPagination}
                totalCount={totalCount}
                onSendBarcode={handleSendBarcodeToGenerate}
            />

            {/* Generate Barcode Modal */}
            <ModalComponent
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

            {/* Confirmation Modal */}
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
            </ModalComponent>

            {
                loading && (
                    <LoaderComponent />
                )
            }
        </Box>
    )
}

export default GenerateBarcodeComponent