#!/bin/bash

# Layout prefix is prepended to each markdown file synced
###################################################################
LAYOUT_PREFIX='---\nlayout: default\n---\n'

# Switch to build_site branch to sync it with master
###################################################################
git checkout build_site
git pull

# Sync _config.yml
###################################################################
git checkout master -- _config.yml

# Sync the README.md in master to index.md adding jekyll header
###################################################################
git checkout master -- README.md
echo -e $LAYOUT_PREFIX > index.md
cat README.md >> index.md
rm README.md
git add index.md

# Sync the markdown files in the docs/* directory
###################################################################
git checkout master -- docs

if [[ -f docs/index.md ]]; then
    echo -e $LAYOUT_PREFIX | cat - "docs/index.md" > temp
    mv temp docs/index.md
fi

FILES=$(find docs -not -path 'docs/api/*' -not -name '*index.md' -name '*.md' -or -not -path 'docs/api/*' -not -name '*index.html' -name '*.html')
for file in $FILES
do
    echo -e $LAYOUT_PREFIX | cat - "$file" > temp
    if [[ ! -d "${file%.*}" ]]; then
        mkdir -p "${file%.*}"
    fi
    mv temp "${file/\.//index.}"
    rm "$file"
done

git add docs
git commit -a -m "Sync README and docs from master branch to build_site"

# Build the site
echo "build start"
jekyll b
echo "build done"

git add .
git commit -a -m "Built site on `date +'%Y-%m-%d %H:%M:%S'`"

# Push build_site
git push origin build_site

# Switch to gh-pages branch to sync it with build_site /_site
git checkout gh-pages
git pull

git checkout build_site -- _site
cp -r _site/ .
rm -rf _site
git add .
git commit -a -m "Site updated on `date +'%Y-%m-%d %H:%M:%S'`"
git push origin gh-pages

# Finally, switch back to the master branch and exit block
git checkout master
