import { GroupCreate } from "@components/contentTemplate/contentTemplate-group/group-create";
import { Property, PropertyGroup } from "@lib/field/data/field.model";
import { Stack } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import React from "react";
import { objArrayToHashmap } from "utils/arrayModify";
import { PropertyList } from "../property-list";

interface PropertyManagerProps {
    properties: Property[];
    propertyGroups: PropertyGroup[];
}

export const PropertyManager = ({ properties, propertyGroups }: PropertyManagerProps) => {
    return (
        <Stack>
            <PropertyList
                properties={properties}
                propertyGroups={propertyGroups}
                onMove={console.log}
            />
        </Stack>
    );
};
