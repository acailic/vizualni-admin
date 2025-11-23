import SuperJSON from "superjson";
export const serializeProps = (props) => {
    const { json: sprops, meta } = SuperJSON.serialize(props);
    if (meta) {
        // @ts-ignore
        sprops._superjson = meta;
    }
    return sprops;
};
export const deserializeProps = (sprops) => {
    const { _superjson, ...props } = sprops;
    return SuperJSON.deserialize({
        json: props,
        meta: _superjson,
    });
};
