import { Grid, Textarea } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React, { useState } from "react";
import { arrayToCommaList, commaListToArray } from "utils/arrayModify";
import { useSnapshot } from "valtio";

export const BasicFieldsSelect = () => {
    const { fieldDetails, updateFieldDetails } = useSnapshot(contentTypeState);
    const [list, setList] = useState(
        arrayToCommaList(fieldDetails?.config?.options ?? [])
    );
    const updateOptions = (list: string) => {
        setList(list);
        updateFieldDetails({
            config: { ...fieldDetails.config, options: commaListToArray(list) },
        });
    };
    return (
        <Grid.Col span={12}>
            <Textarea
                label="Options"
                required
                description="Enter a list of options seperated by commas"
                placeholder="eg: first, second, third"
                value={list}
                onChange={(event) => updateOptions(event.currentTarget.value)}
            ></Textarea>
        </Grid.Col>
    );
};
