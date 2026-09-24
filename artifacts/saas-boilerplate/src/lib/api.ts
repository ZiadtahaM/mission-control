import { setAuthTokenGetter } from "@workspace/api-client-react";

export function setTokenGetter(fn: (() => string | null) | null) {
  setAuthTokenGetter(fn);
}
