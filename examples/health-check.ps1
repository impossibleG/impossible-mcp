$response = Invoke-RestMethod -Uri 'http://127.0.0.1:3333/healthz'
if ($response.status -ne 'ok') {
    throw 'MCP server health check failed'
}
Write-Output 'MCP server is healthy'
