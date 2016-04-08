---
layout: default
---

# Release Process
<!-- [[TOC]] -->

## Releasing A New Version

To release a new version of the Magazine Tool, run the `grunt dist` command. This will update your dependencies, run a full distribution build and bump the version. Grunt will ask you if this is a patch, minor or major change. The difference between are indicated when you need to choose. If you want to do some further reading on this, read the [Semantic Versioning][semver] spec.

Once the Grunt task has completed, you will need to upload the changed files to Alfresco. Check the diff for the [latest commit on the repo][repo.commits] that was created by the Grunt `dist` command. The commit message should real something like `Release: v1.x.x`. When you open that commit you should be able to see which files withing the `dist` directory have changed. Those are the files you need to upload to Alfresco Assets under [magazine/_shared/contents/MagTool][alfresco.magtool].

Finally, when you have uploaded the files to Alfresco and published them to staging, create a [new release][repo.releases] on GitHub using the latest version tag. This tag was automatically created for you by the Grunt `dist` task.

[semver]: http://semver.org/
[repo.commits]: https://github.com/NAPWebProductionEditTeam/MagTool2/commits/master
[repo.releases]: https://github.com/NAPWebProductionEditTeam/MagTool2/releases
[alfresco.magtool]: http://cat-alfresco.nap:18080/share/page/site/alfrescoAssets/documentlibrary#filter=path%7C%2Fnap%2FwebAssets%2Fmagazine%2F_shared%2Fcontents%2FMagTool%7C&page=1
