# Contributing

Thanks for your interest in contributing to [bolhadev.chat](https://bolhadev.chat). We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [@brunocroh](https://twitter.com/brunocroh).

## About this repository

This repository is a monorepo.

- We use [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) for development.
- We use [Turborepo](https://turbo.build/repo) as our build system.

## Structure

This repository is structured as follows:

```
apps
└── web
└── server
```

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/bolhadev.chat.git
```

### Navigate to project directory

```bash
cd bolhadev-chat
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Rename .env.template to .env

```bash
mv .env.template .env
```

### Run a workspace

You can use the `pnpm --filter=[WORKSPACE]` command to start the development process for a workspace.

#### Examples

1. To run the the entire project:

```bash
pnpm run dev
```

2. To run client

```bash
pnpm run dev --filter web
```

3. To run backend:

```bash
pnpm run dev --filter server
```

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

  e.g. `feat(web): add new awesome feature`

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/

## Requests for new features

If you have a request for a new feature, please open a issue on GitHub. We'll be happy to help you out.
