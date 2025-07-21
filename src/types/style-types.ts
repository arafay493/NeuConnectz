// Note: Custom styles types are defined here...!

export interface CustomStyles {
    colors: {
        white: string;
        black: string;
        red: string;
        green: string;
        _408CCE: string;
        _4D4D4D: string;
        _909090: string;
        _1B59F8: string;
        _4A4A4A: string;
        _F5F7FA: string;
        _ECECEC: string;
        _F8F9FA: String;
        _1B59F81A: string;
        evenTableColor: string;
        tableRowBorderColor: string;
    };

    deviceSize: {
        xs: "xs",
        sm: "sm";
        md: "md";
        lg: "lg";
        xl: "xl";
    },

    size: {
        size_1: string;
        size_2: string;
        size_3: string;
        size_4: string;
        size_5: string;
        size_6: string;
        size_7: string;
        size_8: string;
        size_9: string;
        size_10: string;
        size_15: string;
        size_20: string;
        size_25: string;
        size_40: string;
        size_500: string;
    };

    sizeWidthAndHeight: {
        fullWidth: string;
        viewWidth: string;
        viewHeight: string;
    };

    elementDirection: {
        displayFlex: "flex";
        flexStart: "flex-start"
        row: "row";
        column: "column";
    };

    alignment: {
        center: "center";
        left: "left";
        right: "right";
        spaceBetween: "space-between";
    };

    elementPosition: {
        relative: "relative";
        absolute: "absolute";
    };

    textTransformation: {
        uppercase: "uppercase";
        lowercase: "lowercase";
        capitalize: "capitalize";
        none: "none";
    };

    textDecoration: {
        none: "none";
        underline: "underline";
    }
};