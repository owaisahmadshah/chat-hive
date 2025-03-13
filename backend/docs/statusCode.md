# **\ud83d\udcccp HTTP Status Codes for ChatHive API**

## **\u2705 Success Responses (2xx)**
| Code | Meaning | Description |
|------|---------|-------------|
| **200 OK** | Success | The request was successful. |
| **201 Created** | Resource Created | A new resource (e.g., message, user) was successfully created. |
| **202 Accepted** | Processing | The request has been accepted but is still being processed. |
| **204 No Content** | Success (No Data) | The request was successful, but there is no content to return. |

## **\ud83d\udd04 Client Errors (4xx)**
| Code | Meaning | Description |
|------|---------|-------------|
| **400 Bad Request** | Invalid Request | The request is malformed or missing required fields. |
| **401 Unauthorized** | Authentication Required | The user is not authenticated (invalid token, not logged in). |
| **403 Forbidden** | Access Denied | The user is authenticated but does not have permission to access the resource. |
| **404 Not Found** | Resource Not Found | The requested resource (user, chat, message) does not exist. |
| **409 Conflict** | Conflict Detected | A conflict occurred, such as a duplicate message or username. |
| **413 Payload Too Large** | Large Request | The uploaded file or message exceeds the size limit. |
| **429 Too Many Requests** | Rate Limit Exceeded | The user is making too many requests in a short time. |

## **\ud83d\udca5 Server Errors (5xx)**
| Code | Meaning | Description |
|------|---------|-------------|
| **500 Internal Server Error** | Server Crash | A generic server-side error occurred. |
| **502 Bad Gateway** | Upstream Error | The server received an invalid response from an upstream service. |
| **503 Service Unavailable** | Server Overloaded | The service is temporarily unavailable (e.g., maintenance, high traffic). |
| **504 Gateway Timeout** | Timeout | The request took too long to process. |

## **\ud83d\ude80 ChatHive-Specific Status Codes (Custom)**
If you want **custom application-level responses**, you can use standard codes with custom messages:

| Code | Meaning | Example Message |
|------|---------|----------------|
| **422 Unprocessable Entity** | Invalid Data | "Message content cannot be empty." |
| **426 Upgrade Required** | Old API Version | "Please update your ChatHive app to continue." |
| **451 Unavailable for Legal Reasons** | Banned | "This chat is blocked due to policy violations." |

