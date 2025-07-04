---
title: PlayTube
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# PlayTube

Base URLs:

* <a href="http://localhost:8000/api/v1">Develop Env: http://localhost:8000/api/v1</a>

# Authentication

- HTTP Authentication, scheme: bearer

# Default

## GET health check

GET /health

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# users

## GET get loggedin user

GET /users/current-user

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## POST login

POST /users/login

> Body Parameters

```json
{
  "username": "subrata",
  "password": "@1Iamsubrata"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|

## POST logout

POST /users/logout

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## POST Refresh access token

POST /users/refresh-accessToken

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|x-refresh-token|header|string| yes |none|

> Response Examples

> 201 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|
|»» accessToken|string|true|none||access token|
|»» refreshToken|string|true|none||none|

## GET get user watch History

GET /users/watch-history

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": [
    "string"
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|[string]|true|none||Response Data|

## POST create user

POST /users/register

> Body Parameters

```yaml
fullName: Alice Kumar two
username: alicek992
email: alice.kumar2@example.com
password: "@1Iamalice"
avatar: file:///home/subrata/Pictures/Camera/passport_size_complete1.png
coverImage: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» fullName|body|string| yes |none|
|» username|body|string| yes |none|
|» email|body|string| yes |none|
|» password|body|string| yes |none|
|» avatar|body|string(binary)| yes |none|
|» coverImage|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "success": true,
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||status|
|» message|string|true|none||Response Message|
|» success|boolean|true|none||Success or not|
|» data|object¦null|true|none||Response Data|

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH update avatar

PATCH /users/updated-avatar

> Body Parameters

```yaml
avatar: file:///home/subrata/Pictures/Camera/passport_size_complete2.png

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» avatar|body|string(binary)| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH update cover image

PATCH /users/updated-coverImage

> Body Parameters

```yaml
coverImage: file:///home/subrata/Pictures/Screenshots/Screenshot From 2025-06-28
  23-05-40.png

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» coverImage|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# video

## GET get many video

GET /v/

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|page|query|number| no |none|
|limit|query|number| no |none|
|query|query|string| no |none|
|sortBy|query|string| no |none|
|sortType|query|string| no |none|
|userId|query|string| no |none|

#### Enum

|Name|Value|
|---|---|
|sortBy|desc|
|sortBy|asc|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "data": {},
  "success": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|» success|boolean|true|none||none|

## GET get single video

GET /v/{id}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|id|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "data": {},
  "success": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|» success|boolean|true|none||none|

# channel

## GET get channel details

GET /c/u/{username}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|username|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## GET get channel stats

GET /c/dashboard

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|userId|query|string| no |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "createdAt": "string",
    "totalLikes": 0,
    "totalVideos": 0,
    "totalSubscribers": 0,
    "totalSubscribed": 0,
    "totalViews": 0
  },
  "message": "string",
  "success": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||none|
|» data|object|true|none||none|
|»» _id|string|true|none||none|
|»» username|string|true|none||none|
|»» email|string|true|none||none|
|»» fullName|string|true|none||none|
|»» createdAt|string|true|none||none|
|»» totalLikes|integer|true|none||none|
|»» totalVideos|integer|true|none||none|
|»» totalSubscribers|integer|true|none||none|
|»» totalSubscribed|integer|true|none||none|
|»» totalViews|integer|true|none||none|
|» message|string|true|none||none|
|» success|boolean|true|none||none|

## POST subscribe channel

POST /c/subscribe/{id}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|id|path|string| yes |none|

> Response Examples

> 201 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE unsubscribe channel

DELETE /c//unsubscribe/{channelId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channelId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|

## POST upload video

POST /c/upload

> Body Parameters

```yaml
title: Testing video 2
description: "This is testing video 2 "
isPublished: "true"
video: file:///home/subrata/Videos/sample/129427-744370618_medium.mp4
thumbnail: file:///home/subrata/Pictures/Screenshots/Screenshot From 2025-02-09
  22-46-24.png

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» title|body|string| yes |none|
|» description|body|string| yes |none|
|» isPublished|body|boolean| no |none|
|» video|body|string(binary)| yes |none|
|» thumbnail|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "success": true,
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||status|
|» message|string|true|none||Response Message|
|» success|boolean|true|none||Success or not|
|» data|object¦null|true|none||Response Data|

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH toggle publish video

PATCH /c/toggle-publish/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH update video details

PATCH /c/update/{videoId}

> Body Parameters

```yaml
title: ""
description: ""
thumbnail: file:///home/subrata/Pictures/Screenshots/Screenshot From 2025-05-07
  20-51-19.png

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|
|body|body|object| no |none|
|» title|body|string| no |none|
|» description|body|string| no |none|
|» thumbnail|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PUT add view to video

PUT /c/views/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE delete video

DELETE /c/delete/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# comment

## GET get all video comments

GET /comment/v/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|
|page|query|integer| no |none|
|limit|query|integer| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## GET get all tweet comments Copy

GET /comment/t/{tweetId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|tweetId|path|string| yes |none|
|page|query|integer| no |none|
|limit|query|integer| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## POST add comment

POST /comment/create

> Body Parameters

```yaml
content: "This is testing 2 "
videoId: ""
tweetId: 6726479f23cf0d8601f66e31

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» content|body|string| yes |none|
|» videoId|body|string| no |none|
|» tweetId|body|string| no |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "success": true,
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||status|
|» message|string|true|none||Response Message|
|» success|boolean|true|none||Success or not|
|» data|object¦null|true|none||Response Data|

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH update comment

PATCH /comment/update/{commentId}

> Body Parameters

```yaml
content: Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum delectus
  at, animi consequuntur dolorum doloribus perspiciatis explicabo placeat,
  eligendi excepturi, omnis sed voluptas recusandae natus aperiam maiores quod.
  Natus obcaecati, cumque aperiam explicabo quas quia quidem nisi molestias,
  blanditiis, repellendus incidunt recusandae aspernatur sunt nobis itaque. Ex
  et corporis magnam exercitationem neque ipsum explicabo error, voluptate
  libero vel consectetur repellat consequuntur id laborum molestiae impedit
  quibusdam voluptatem reprehenderit animi qui. Quibusdam, fugiat modi vero,
  culpa laboriosam magnam possimus ullam dicta nulla architecto veritatis.
  Reprehenderit cupiditate eveniet sunt! Vel cupiditate deserunt necessitatibus
  mollitia explicabo quibusdam provident! Eaque, at. Debitis, ipsum
  necessitatibus shshkkj

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|commentId|path|string| yes |none|
|body|body|object| no |none|
|» content|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE delete comment

DELETE /comment/delete/{commentId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|commentId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# tweet

## GET get users tweet

GET /tweet/{userId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": [
    {}
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|[object]|true|none||Response Data|

## POST create tweet

POST /tweet/create

> Body Parameters

```yaml
content: This is my content for tweet 1

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» content|body|string| no |none|

> Response Examples

> 201 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE delete tweet

DELETE /tweet/delete/{tweetId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|tweetId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PATCH update tweet

PATCH /tweet/update/{tweetId}

> Body Parameters

```yaml
content: This is my content for tweet 1 edited

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|tweetId|path|string| yes |none|
|body|body|object| no |none|
|» content|body|string| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# like

## POST toggle video like

POST /like/v/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## POST toggle comment like

POST /like/c/{commentId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|commentId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## POST toggle tweet like

POST /like/t/{tweetId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|tweetId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## GET get liked video

GET /like/liked-videos

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": [
    {}
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|[object]|true|none||Response Data|

# playlist

## POST create playlist

POST /playlist/create

> Body Parameters

```yaml
name: playlist one
description: "This is playlist one "
videoId: 68656393ed6190f9c9442850

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» name|body|string| yes |name|
|» description|body|string| yes |none|
|» videoId|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": 0,
  "message": "string",
  "success": true,
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|integer|true|none||status|
|» message|string|true|none||Response Message|
|» success|boolean|true|none||Success or not|
|» data|object¦null|true|none||Response Data|

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## GET get user playlists

GET /playlist/u/{userId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": [
    {}
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|[object]|true|none||Response Data|

## PATCH update playlist details

PATCH /playlist/update/{playlistId}

> Body Parameters

```yaml
name: Playlist one Edited
description: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|playlistId|path|string| yes |none|
|body|body|object| no |none|
|» name|body|string| no |name|
|» description|body|string| no |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE delete playlist

DELETE /playlist/delete/{playlistId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|playlistId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## GET get one playlist

GET /playlist/{playlistId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|playlistId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## PUT add video to playlist

PUT /playlist/add/{playlistId}/v/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|playlistId|path|string| yes |none|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

## DELETE remove video from playlist

DELETE /playlist/delete/{playlistId}/v/{videoId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|playlistId|path|string| yes |none|
|videoId|path|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "success": true,
  "status": 0,
  "message": "string",
  "data": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» success|boolean|true|none||Success or not|
|» status|integer|true|none||status|
|» message|string|true|none||Message|
|» data|object|true|none||Response Data|

# Data Schema

