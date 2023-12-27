import { useMemo } from "react";
import { Client, ClientOptions } from "../../classes/Client";

const useClient = (options?: ClientOptions) => {
  const client = useMemo(() => {
    return new Client(options)
  }, [])

  return client
}

export default useClient