import ScanProductionOrderComponent from '@/components/production-order/ScanProductionOrderComponent';

const ScanProductionOrderScreen = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <ScanProductionOrderComponent id={id} />
    )
}

export default ScanProductionOrderScreen