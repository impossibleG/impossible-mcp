# 0001: Share one server factory

Status: accepted

Both transports instantiate the same `buildServer` factory. Capability behavior therefore remains consistent across local and remote deployments, and protocol tests can exercise the same registration code used in production.
