import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Stack } from "@mantine/core";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { ContentTemplateCard } from "../contentTemplate-card";

interface ContentTemplateListProps {
    contentTemplates: CleanedCamel<ContentTemplate>;
}
export const ContentTemplateList = ({ contentTemplates }: ContentTemplateListProps) => {
    return (
        <Stack px="md" py="sm" spacing="sm">
            {contentTemplates?.length
                ? contentTemplates
                      .filter((template) => template.templateType === templateType)
                      .map((contentTemplate, i) => (
                          <a
                              key={contentTemplate.id}
                              onClick={() => setActiveTemplate(contentTemplate)}
                          >
                              <ContentTemplateCard
                                  contentTemplate={contentTemplate}
                                  active={contentTemplate.id === activeTemplate?.id}
                              />
                          </a>
                      ))
                : "No content templates found"}
        </Stack>
    );
};
