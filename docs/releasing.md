# Releasing

Run `npm run verify`, inspect the dependency audit, and update `CHANGELOG.md`. Create a signed version tag that matches the package version. The release workflow rebuilds, verifies, and attaches a source package to the GitHub release.

Do not publish the template package to npm until the package scope and provenance settings have been reviewed.
