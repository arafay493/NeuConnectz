// Note: This file contains constants related to saving PDF files in the application. It defines the file name and the MIME type for PDF files.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { customStyles } from "@/styles/custom-theme";

interface pdfObj {
    id: string;
    docNum: number;
    doNumber: string;
    transportMode: string;
    deliveryDate: string;
    docStatus: string;
    createdBy: string,
    updatedBy: string,
    totalItems: string,
    totalQuantity: string,
    salesOrder: {
        id: string,
        salesOrderNumber: string,
        soDate: string,
        deliveryDate: string,
        customer: {
            customerCode: string,
            customerName: string
        }
    },
    vehicle: {
        vehicleNumber: string
    },
    driver: {
        driverName: string,
        driverContact: string,
        cnic: string
    },
    contractor: {
        contractorName: string
    },
    warehouse: {
        whsCode: string,
        whsName: string
    },
    items: [
        {
            id: string,
            itemCode: string,
            itemName: string,
            quantity: string,
            uoM: string,
            docStatus: string,
            sapStatus: string
        }
    ],
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

// const dataSet = (data: pdfObj[]) => {
//     console.log('Generating PDF with data: ', data);

//     const tableData = data?.map(report => [
//         new Date(report.deliveryDate).toLocaleDateString(),
//         report.salesOrder?.customer?.customerName,
//         report.totalItems,
//         report.totalQuantity,

//         report.items.map(x => x.itemCode).join('\n'),
//         report.items.map(x => x.itemName).join('\n'),
//         report.items.map(x => x.quantity).join('\n'),

//         report.driver?.driverName,
//         report.driver?.driverContact,
//         report.driver?.cnic,
//         report.vehicle?.vehicleNumber
//     ]);

//     return tableData;
// }

// const generatePDF = (deliveryOrderData : any) => {

//     const tableData = dataSet([deliveryOrderData]);

//     // Note: Document configuration for PDF generation...!
//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//     });

//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");

//     // Note: Header for the PDF report...!
//     doc.text(
//         "Delivery Gate Pass Report With Driver Details",
//         148,
//         20,
//         { align: "center" }
//     );

//     autoTable(doc, {
//         startY: 30,

//         // Note: Table headers for the PDF report...!
//         head: [[
//             "Delivery Date",
//             "Customer Name",
//             "Total Items",
//             "Sum of Item Quantity",
//             "Item Code",
//             "Item Description",
//             "Item Quantity",
//             "Driver Name",
//             "Driver Mobile",
//             "Driver CNIC",
//             "Vehicle No",
//         ]],

//         // Note: Table body data for the PDF report...!
//         body: tableData,

//         theme: "grid",

//         // Note: Styles for the table header and body in the PDF report...!
//         headStyles: {
//             fillColor: [144, 238, 144],
//             textColor: [0, 0, 0],
//             fontStyle: "bold",
//             halign: "center",
//             lineColor: [0, 0, 0],
//             lineWidth: 0.2,
//         },

//         // Note: Styles for the table header and body in the PDF report...!
//         bodyStyles: {
//             textColor: [0, 0, 0],
//             lineColor: [0, 0, 0],
//             lineWidth: 0.2,
//             fontSize: 8,
//         },

//         styles: {
//             overflow: "linebreak",
//             cellPadding: 2,
//             fontSize: 8,
//             valign: "middle",
//         },

//         margin: {
//             left: 5,
//             right: 5,
//         },
//     });

//     doc.save("DeliveryGatePassReport.pdf");
// };

// export default generatePDF;

export const downloadDeliveryChallan = (data: pdfObj) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // =========================
    // Header
    // =========================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(18);
    doc.text("MASTER LUBRICANTS", 105, 15, { align: customStyles.alignment.center });

    doc.setFontSize(12);
    doc.text("Delivery Challan", 105, 22, { align: customStyles.alignment.center });

    doc.setFontSize(10);
    doc.text(`Serial No : ${data.docNum}`, 14, 35);

    doc.text(
        `Date : ${new Date(data.deliveryDate).toLocaleDateString()}`,
        pageWidth - 14,
        35,
        { align: "right" }
    );

    // Customer Box

    doc.rect(14, 40, 182, 18);

    doc.text(
        `Customer : ${data.salesOrder.customer.customerName}`,
        18,
        47
    );

    doc.text(
        `Vehicle : ${data.vehicle.vehicleNumber}`,
        18,
        53
    );

    doc.text(
        `Driver : ${data.driver.driverName}`,
        pageWidth - 18,
        47,
        { align: "right" }
    );

    doc.text(
        `Contact : ${data.driver.driverContact}`,
        pageWidth - 18,
        53,
        { align: "right" }
    );

    // =========================
    // Items Table
    // =========================

    autoTable(doc, {
        startY: 65,
        head: [["#", "Item Code", "Description", "Qty", "UOM"]],

        body: data.items.map((item, index) => [
            index + 1,
            item.itemCode,
            item.itemName,
            item.quantity,
            item.uoM,
        ]),

        styles: {
            fontSize: 9,
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            cellPadding: 2,
        },

        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: customStyles.alignment.center,
        },

        bodyStyles: {
            textColor: [0, 0, 0],
        },

        theme: "grid",
    });

    // =========================
    // Totals
    // =========================

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");

    doc.text(`Total Items : ${data.totalItems}`, 14, finalY);
    doc.text(
        `Total Qty : ${data.totalQuantity}`,
        pageWidth - 14,
        finalY,
        { align: "right" }
    );

    // =========================
    // Footer
    // =========================

    const signY = 255;

    // Left Signature
    doc.line(20, signY, 80, signY);
    doc.text("Prepared By", 50, signY + 6, {
        align: "center",
    });

    // Right Signature
    doc.line(130, signY, 190, signY);
    doc.text("Received By", 160, signY + 6, {
        align: "center",
    });
    
    doc.save(`Delivery-Challan-${data.docNum}.pdf`);
};

export default downloadDeliveryChallan;