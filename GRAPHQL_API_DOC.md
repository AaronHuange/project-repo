## form 模块

- query

```graphql
query queryForm(
  $pagination:PaginationInput!,
  $filter: QueryFormFilterInputType!
){
  queryForm(pagination:$pagination, filter:$filter){
    data {
      id, name, parentId, jsonField, creatorId, creatorName, version, public,
      isDel, isNewest, createdAt, updatedAt
    }
    pagination{
      current_page
      page_size
      total_count
      total_pages
    }
  }
}

```

```json
{
  "pagination": {
    "page": 1,
    "page_size": 10
  },
  "filter": {
    "createdAt": {
      "between": [
        1,
        2
      ]
    }
  }
}
```

- create

```graphql
mutation createForm($input:CreateFormInputType!){
  createForm(input:$input){
    parentId,
    name,
    jsonField,
    version,
  }
}
```

```json
{
  "input": {
    "formId": "22",
    "name": "test",
    "jsonField": "{\"a\":1}",
    "version": "1.0.0"
  }
}
```

- update

```graphql
mutation updateForm($input:UpdateFormInputType!){
  updateForm(input:$input){
    name,
    jsonField,
    version,
  }
}
```

```json
{
  "input": {
    "formId": "22",
    "name": "test",
    "jsonField": "{\"a\":1}",
    "version": "1.0.0"
  }
}
```

- query

```graphql
query queryTrashForm(
  $pagination:PaginationInput!,
  $filter: QueryTrashFormFilterInputType!
){
  queryTrashForm(pagination:$pagination, filter:$filter){
    data {
      id, name, parentId, jsonField, creatorId, creatorName, version, public,
      isDel, isNewest, createdAt, updatedAt
    }
    pagination{
      current_page
      page_size
      total_count
      total_pages
    }
  }
}

```

```json
{
  "pagination": {
    "page": 1,
    "page_size": 10
  },
  "filter": {
    "createdAt": {
      "between": [
        1,
        2
      ]
    }
  }
}
```


