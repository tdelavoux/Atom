# Atom

## Contributing

The files are built using [`grunt`](https://gruntjs.com/) (run `npm install` to install it). SCSS files can be found in `src/css/`, and Javascript are in `src/js/`.

To build (concatenate and minify) the files after your changes, use `npm run build`.

Code-style is enforced by [`prettier`](https://prettier.io), automatically ran before `git commit` with `lint-staged` and `husky`.
