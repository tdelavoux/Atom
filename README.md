<div align="center">
  <img src="https://user-images.githubusercontent.com/31383617/177853237-63dafe5a-f3ff-4eb8-a9a1-1359a1825cc2.png"  width="250" height="250">
</div>

<p align="center">
  Light front-end framework designed for faster web developments.
  <br>
  <!--<a href="#"><strong>Explore online documentation</strong></a>-->
</p>

## Contributing

The files are built using [`grunt`](https://gruntjs.com/) (run `npm install` to install it). SCSS files can be found in `src/css/`, and Javascript are in `src/js/`.

To build (concatenate and minify) the files after your changes, use `npm run build`.

Code-style is enforced by [`prettier`](https://prettier.io), automatically ran before `git commit` with `lint-staged` and `husky`.

Commits follow the [conventional commits](https://www.conventionalcommits.org/) convention.

```
<type>([optional scope]): <description>
```

For this project:

- `optional scope` are `css`, `js` or the specific component (i.e. `datatables` or `collapse`)
- main `type` are `feat`, `fix`, `docs` or `chore`.

## Cutting a release

Create a new release by following these 4 steps:

1. Update the version
   - Remove `-dev` from the `version` in `package.json`
   - Run `npm install --package-lock-only` to update the version in `package-lock.json`
   - Run `npm run build` to build the version locally
   - Commit `git add package*.json && git commit --message="chore: release vX.X.X"` with the two files changed
2. Create a tag `git tag vX.X.X`
3. Bump the next dev version
   - Bump the `version` in `package.json`, with the `-dev` suffix
   - Run `npm install --package-lock-only` to update the version in `package-lock.json`
   - Commit `git add package*.json && git commit --message="chore: bump version to vX.X.X-dev"` with the two file changed
4. Push them on the remote: `git push && git push --tags`
