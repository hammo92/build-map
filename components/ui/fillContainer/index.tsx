import useMeasure from "react-use-measure";
import React from "react";
import { Box } from "@mantine/core";

export const FillContainer = ({ children }) => {
    const [ref, bounds] = useMeasure();
    return (
        <Box ref={ref} sx={{ height: "100%" }}>
            <Box
                sx={{
                    height: `${bounds.height}px`,
                    width: `${bounds.width}px`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
