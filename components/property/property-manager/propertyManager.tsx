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
    const [propertiesMap, setProperties] = useSetState(objArrayToHashmap(properties, "id"));
    const [propertyGroupsMap, setPropertyGroups] = useSetState(
        objArrayToHashmap(propertyGroups, "id")
    );
    return (
        <Stack>
            <PropertyList properties={properties} propertyGroups={propertyGroups}  onMove={console.log} />                                                                                                                                                                                                                                                                                                                                                                                                                                           />
        </Stack>
    )

};
