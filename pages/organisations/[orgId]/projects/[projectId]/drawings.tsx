import Tree, {
    TreeItem,
    TreeData,
    RenderItemParams,
    ItemId,
    mutateTree,
    TreeSourcePosition,
    TreeDestinationPosition,
    moveItemOnTree,
} from '@atlaskit/tree'
import { params as cloudParams } from '@serverless/cloud'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { NestedProjectLayout } from 'layouts/layouts-nested/nested-projectLayout'
import { GetServerSidePropsContext } from 'next'
import { ReactElement, useState } from 'react'
import auth0 from 'utils/auth0'

import React from 'react'
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import { Box, Container, Group, Stack } from '@mantine/core'
import { DrawingUpload } from '@components/ui/drawingUpload'
import {
    useGetDrawingCollection,
    useGetDrawingCollectionByProject,
} from '@data/drawing/hooks'
import { Drawing, DrawingCollection } from '@lib/drawing/data/drawing.model'
import { FileUpload } from '@components/ui/fileUpload'
import { objectify } from 'radash'
import { CleanedCamel } from 'type-helpers'
import invariant from 'tiny-invariant'
import structuredClone from '@ungap/structured-clone'
import OlViewer from '@components/ui/olZoom'
interface Todo {
    id: string
    title: string
}

const convertToTree = (
    drawingCollection: CleanedCamel<DrawingCollection>,
    drawings: CleanedCamel<Drawing>[]
): TreeData => {
    const groupClone = structuredClone(drawingCollection)
    const indexedGroups = objectify(groupClone!.groups, (g) => g.id)
    const items = drawings.reduce<Record<string, TreeItem>>(
        (acc, { parent, id, ...rest }) => {
            acc[id] = {
                id,
                data: { id, ...rest },
                hasChildren: false,
                isExpanded: false,
                isChildrenLoading: false,
                children: [],
            }
            indexedGroups[parent ?? '1'].children.push(id)
            return acc
        },
        {}
    )
    console.log('items', { ...items, ...indexedGroups })
    return {
        rootId: '1',
        items: {
            ...items,
            ...indexedGroups,
        },
    }
}

export interface DrawingPageProps {
    orgId: string
    projectId: string
    drawings: CleanedCamel<Drawing>[]
    drawingCollection: CleanedCamel<DrawingCollection>
}

function Drawings({
    orgId,
    projectId,
    drawings,
    drawingCollection,
}: DrawingPageProps) {
    const { data, isLoading } = useGetDrawingCollectionByProject({
        projectId,
        initialData: {
            collection: drawingCollection,
            drawings,
        },
    })
    const [url, setUrl] = useState<string>()
    const [tree, setTree] = useState<TreeData>({})

    if (isLoading || !data?.collection || !data?.drawings) return <p>Loading</p>

    function TreeItem({
        item,
        onExpand,
        onCollapse,
        provided,
    }: RenderItemParams) {
        return (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => setUrl(item.data.tiledPath)}
            >
                {item.data.name}
            </div>
        )
    }

    const onExpand = (itemId: ItemId) =>
        setTree(mutateTree(tree, itemId, { isExpanded: true }))

    const onCollapse = (itemId: ItemId) =>
        setTree(mutateTree(tree, itemId, { isExpanded: false }))

    const onDragEnd = (
        source: TreeSourcePosition,
        destination?: TreeDestinationPosition
    ) => {
        if (!destination) {
            return
        }
        setTree(moveItemOnTree(tree, source, destination))
    }

    return (
        <Group p="md" spacing="sm">
            <Stack>
                <FileUpload
                    multiple
                    onUpload={console.log}
                    type="drawing"
                    groupId="1"
                    collectionId={data?.collection.id}
                />
                <Tree
                    tree={convertToTree(data?.collection, data?.drawings)}
                    renderItem={(props) => {
                        return <TreeItem {...props} />
                    }}
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    isDragEnabled={true}
                    isNestingEnabled={false}
                    onDragEnd={onDragEnd}
                    //offsetPerLevel={20}
                />
            </Stack>
            <Box sx={{ flex: 1 }} p="md">
                {url ? <OlViewer url={url} /> : <p>Click a drawing to view</p>}
            </Box>
        </Group>
    )
}

Drawings.getLayout = (page: ReactElement) => (
    <NestedProjectLayout>{page}</NestedProjectLayout>
)

export async function getServerSideProps({
    params,
    req,
    res,
}: GetServerSidePropsContext<{ projectId: string }>) {
    const session = auth0.getSession(req, res)
    const headers = {
        ...req.cookies,
        ...(session && { Authorization: `Bearer ${session.idToken}` }),
    }
    const { projectId } = params!
    const { data } = await axios.get(
        `${cloudParams.CLOUD_URL}/projects/${projectId}/drawingCollection`,
        {
            headers,
        }
    )
    return {
        props: {
            drawings: data.drawings,
            drawingCollection: data.collection,
            ...params,
        },
    }
}

export default Drawings
