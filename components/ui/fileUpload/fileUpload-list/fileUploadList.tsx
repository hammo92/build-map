import { Group, SimpleGrid } from "@mantine/core";
import Uploader from "@state/uploader/uploader";
import { useSnapshot } from "valtio";
import { FileUploadCard } from "../fileUpload-card";

export const FileUploadList = () => {
    const { uploads, removeUploads } = useSnapshot(Uploader);
    const { length } = uploads;
    const cols = length < 4 ? length : length === 4 ? 2 : 3;
    return length ? (
        <SimpleGrid cols={cols} my="sm">
            {uploads.map(({ file, percentUploaded, uploading }, i) => (
                <FileUploadCard
                    key={i}
                    file={file}
                    remove={() => removeUploads(i)}
                    //update={(item: File) => setItem(i, item)}
                    uploading={uploading}
                    percentageUploaded={percentUploaded}
                />
            ))}
        </SimpleGrid>
    ) : null;
};
