# OHZI Boilerplate


## Requirements
- Node v14+

## Steps to create a new proyect
1. Create a new folder with the name of the new project.
2. Copy all files from `ohzi-boilerplate` folder to the new folder, **except for** `.git` , `core` and `node_modules` folder.
3. Go to the new folder in a terminal and run the following commands:
5. `yarn install`
6. `git init`
7. `git submodule add https://github.com/ohzinteractive/core core`
8. `git submodule update --init`
9. `cd core && git config core.hooksPath git_hooks && cd ..`
10. `git add .`
11. `git commit -m "first commit"`
12. `git branch -M main`
13. `git remote add origin git@github.com:ohzinteractive/...`
14. `git push -u origin main`

## Usage
- `yarn start`

## Build static site
- `yarn build`

## Update core submodule
- `git submodule update --remote`
