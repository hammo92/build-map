import { Keys } from "../constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMe } from "../queries";
import { AxiosError } from "axios";

export function useGetMe() {
    return useQuery([Keys.GET_ME], () => getMe());
}
