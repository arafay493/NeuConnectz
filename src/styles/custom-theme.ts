// Note: All custom css styles are defined in this file...!

import { CustomStyles } from "@/types/style-types";

const customStyles: CustomStyles = {
    colors: {
        white: "#fff",
        black: "#000",
        red: "red",
        green: "green",
        _408CCE: "#408CCE",
        _4D4D4D: "#4D4D4D",
        _909090: "#909090",
        _1B59F8: "#1B59F8",
        _4A4A4A: "#4A4A4A",
        _F5F7FA : "#F5F7FA"
    },

    deviceSize: {
        xs: "xs",
        sm: "sm",
        md: "md",
        lg: "lg",
        xl: "xl",
    },

    size: {
        size_1: "1px",
        size_2: "2px",
        size_3: "3px",
        size_4: "4px",
        size_5: "5px",
        size_6: "6px",
        size_7: "7px",
        size_8: "8px",
        size_9: "9px",
        size_10: "10px",
        size_15: "15px",
        size_20: "20px",
        size_25: "25px",
        size_40: "40px",
        size_500: "500px",
    },

    sizeWidthAndHeight: {
        fullWidth: "100%",
        viewWidth: "100vw",
        viewHeight: "100vh",
    },

    elementDirection: {
        displayFlex: "flex",
        flexStart: "flex-start",
        row: "row",
        column: "column"
    },

    alignment: {
        center: "center",
        left: "left",
        right: "right",
        spaceBetween: "space-between"
    },

    elementPosition: {
        relative: 'relative',
        absolute: 'absolute'
    },

    textTransformation: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
        none: "none"
    },

    textDecoration: {
        none: "none",
        underline: "underline"
    }
};

export { customStyles };