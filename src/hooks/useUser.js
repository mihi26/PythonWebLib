import {useMemo} from "react";

export const useUser = () => {
  return useMemo(() => JSON.parse(localStorage.getItem("@user")), [localStorage.getItem("@user")]);
}
