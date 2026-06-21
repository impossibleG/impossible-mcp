# Security model

The template validates protocol inputs but does not decide what an application is authorized to do. Tool handlers must enforce identity, permissions, tenancy, and resource limits at the operation boundary.

stdio inherits the authority of the process that launched it. HTTP exposure adds network-originated requests and therefore needs authentication, host and origin controls, TLS, and rate limits appropriate to the deployment.

Treat tool descriptions, resource content, prompt arguments, and model output as untrusted data.
