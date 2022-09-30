# **Installation**

Using npm

```bash
$ npm install @banpudev/http-client
```

Using yarn

```bash
$ yarn add @banpudev/http-client
```

Using pnpm

```bash
$ pnpm add @banpudev/http-client
```

# **Usage**

## Config
config.ts

```ts
import { HttpClientFactory } from '@banpudev/http-client';
import { getAccessToken } from '@banpudev/react-auth';

const http = new HttpClientFactory(
  apiURL,
  getAccessToken,
  version,
  timeout,
  ignoreLoadingRequest,
  ignoreErrorRequest,
  unwrap,
);
```

## Constructor

| Name | Type | Description 
| --- | --- | --- |
| apiURL | string | base api url
| getAccessToken | func | function get access token from react-auth
| version | string | api version
| timeout | number | timeout for api callouts
| ignoreLoadingRequest | IgnoreService[ ] | ignore of server loader$
| ignoreErrorRequest | IgnoreService[ ] | ignore of server error$
| unwrap | func \| undefined | unwrap response data from api
| onError | ErrorFunction | call back function for to do error
| onLog | LogFunction | call back function for to do log



## Query
Performing a `GET` request \
class query will be return object of queryKey, queryFn and options for useQuery() \
\
query.ts

```
import {
  FnNone, HttpMethod, query, Request
} from "@banpudev/http-client";
import { http } from "config";

class Query {
  @query({ http, apiUrl, httpMethod: HttpMethod.GET })
  // Q -> type of query string
  // P -> type of parameter
  // example for use parameter "example/:id"
  // B -> type of body
  getData(req: Request<Q, P, B>) {
    return{
      queryKey:"",
      // T is generic type of DTO
      queryFn: FnNone<T>,
      options:{},
    }
  }
}
export default new Query();
```

index.tsx
```
import Query from "query";

const { query } = useQuery(Query.getData({
  stringQuery: {},
  parameter: {},
  body: {}
}))
```

## Mutate
Performing a `POST` request \
class mutate will be return queryFn is callback function for useMutation() \
\
mutate.ts

```
import {
  FnNone, HttpMethod, mutate, Request
} from "@banpudev/http-client";
import { http } from "config";

class Mutate {
  @mutate({ http, apiUrl, httpMethod: HttpMethod.POST  })
  // Q -> type of query string
  // P -> type of parameter 
  // example for use parameter "example/:id"
  // B -> type of body

  // must be `async` berfore function
  async postData(req: Request<Q, P, B>) {
    // T is generic type of DTO
    return FnNone<T>();
  }
}
export default new Mutate();
```

index.tsx
```
import Mutate from "mutate";

const { mutation } = useMutation({queryFn: Mutate.postData})
mutation.mutate({
  stringQuery: {},
  parameter: {},
  body: {}
})
```

## Props
| Name | Type | Description 
| --- | --- | --- |
| http | IHttpClientFactory | 
| apiUrl | string | 
| httpMethod | HttpMethod | `GET` \| `POST` \| `PUT` \| `PATCH` \| `DELETE`
